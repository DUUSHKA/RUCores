import crypto from "crypto";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import {
  groupByAndSum,
  pushCostData,
  pushTimeData,
} from "../types/AnalyticsHelpers";
import {
  TransactionNotRefill,
  monthlyData,
  monthlyProviderData,
  providerStats,
  userStats,
} from "../types/AnalyticsTypes";
import { GetAllQuery, QueryError } from "../types/GenericUtilTypes";
import { ProviderIDMapping } from "../types/ProviderUtilTypes";
import { TransactionModel, TransactionType } from "../types/TransactionModel";
import { UserModel } from "../types/UserModel";
import AvailabilityService from "./AvailabilityService";
import BookingService from "./BookingService";
import FacilityService from "./FacilityService";
import GenericService from "./GenericService";
import SessionService from "./SessionService";
import TransactionService from "./TransactionService";
class UserService extends GenericService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  query: GetAllQuery = {
    limit: 10000,
    offset: 0,
  };
  currDate = new Date();
  year = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  private hashPassword(password: string, salt: string): string {
    const hmac = crypto.createHmac("sha256", salt);
    return hmac.update(password).digest("hex");
  }

  public async createUser(user: UserModel): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.salt = crypto.randomBytes(16).toString("hex");
    newUser.hashedPassword = this.hashPassword(user.password, newUser.salt);
    newUser.roles = user.roles;
    newUser.isProvider = user.isProvider;
    newUser.balance = 0;
    try {
      return await this.repository.save(newUser);
    } catch (error) {
      const queryError = error as QueryError;
      if (queryError.errno === 19) {
        // SQLite error code for UNIQUE constraint failed
        throw new ForbiddenError("Username already exists");
      }
      throw error;
    }
  }

  public async createProvider(provider: UserModel): Promise<UserEntity> {
    if (provider.isProvider === false) {
      throw new ForbiddenError("User is not a provider");
    }
    const baseUser = await this.createUser(provider);
    baseUser.roles.push("provider");
    baseUser.isProvider = true;
    return this.repository.save(baseUser);
  }

  public async getAllByID(
    ids: number[],
    query?: GetAllQuery,
  ): Promise<UserEntity[]> {
    if (ids.length === 0) return [];
    return this.getAll(query, {
      where: ids.map((id: number) => {
        return { id };
      }),
    });
  }
  // const {username, id} = providers[0];
  // equivalent to
  // const username = providers[0].username;
  // const id = providers[0].id;
  // Allows to make following
  // const a = {username, id}
  // Which is {username: username, id: id}

  public async getAllProviderIDs(
    query?: GetAllQuery,
  ): Promise<ProviderIDMapping[]> {
    const providers = await this.getAll(query, {
      where: { isProvider: true },
    });

    return providers.map((provider: UserEntity) => {
      return {
        username: provider.username,
        id: provider.id,
      };
    });
  }

  public async login(
    username: string,
    password: string,
  ): Promise<SessionEntity> {
    const user = await this.repository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedError("Invalid username");
    }
    if (user.hashedPassword !== this.hashPassword(password, user.salt)) {
      throw new ForbiddenError("Invalid password");
    }
    return new SessionService().createSession(user);
  }

  public async logout(token: string) {
    const sessionServ = new SessionService();
    const session = await sessionServ.findSessionByToken(token);
    if (!session) {
      throw new NotFoundError(`${this.name} not found`);
    }
    return sessionServ.repository.remove(session);
  }

  public async updateUser(id: number, user: UserModel): Promise<UserEntity> {
    const userToUpdate = await this.repository
      .findOne({
        where: { id: id },
      })
      .catch((error) => {
        throw new Error(error);
      });
    if (!userToUpdate) {
      throw new Error("User not found");
    }
    userToUpdate.firstName = user.firstName;
    userToUpdate.lastName = user.lastName;
    userToUpdate.username = user.username;
    userToUpdate.email = user.email;
    userToUpdate.salt = crypto.randomBytes(16).toString("hex");
    userToUpdate.hashedPassword = this.hashPassword(
      user.password,
      userToUpdate.salt,
    );
    return this.repository.save(userToUpdate);
  }

  public async deleteUser(id: number): Promise<void> {
    this.delete(id);
  }

  public async liquidateUserBalance(
    id: number,
    widthdrawal: number,
  ): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    //find all future bookings in order to determine pending balance
    const allBookings = await new BookingService().getAllFutureUserBookings(
      user,
    );
    const pendingBalance = allBookings.reduce((acc, booking) => {
      return acc + booking.cost;
    }, 0);
    if (user.balance - pendingBalance < widthdrawal) {
      throw new Error("Insufficient balance");
    }
    user.balance -= widthdrawal;
    return this.repository.save(user);
  }

  //temporary function to add balance to a user
  //Need to integrate with paypal API
  public async addBalance(
    user: UserEntity,
    amount: number,
  ): Promise<UserEntity> {
    const transact = await new TransactionService();
    if (!user) {
      throw new Error("User not found");
    }
    user.balance += amount;
    const transaction: TransactionModel = {
      amountChanged: amount,
      eventDescription: "balance refill",
      date: new Date(),
      user_id: user.id,
      transactionType: TransactionType.Refill,
    };
    await transact.createTransaction(transaction);
    return this.repository.save(user);
  }

  public async userAnalytics(user: UserEntity) {
    const book = (
      await new BookingService().getBookings(user, this.query)
    ).filter(
      (y) => y.startDateTime > this.year && y.startDateTime < this.currDate,
    );
    const transactions = (
      await new TransactionService().getAllTransaction(user, this.query)
    )
      .filter((t) => t.transactionType !== "Refill")
      .filter((y) => y.date > this.year) as TransactionNotRefill[]; // transaction service return TransactionEntity[]. After filter it stil thinks
    //its this type but we need TransactionNotRefill[], so we cast it with as and it will just believe we are correct with the resulting type

    const totalSpend =
      -1 * transactions.reduce((sum, el) => (sum += el.amountChanged), 0); //total amount spent --> takes refunds into consideration
    const averageSpend = parseFloat((totalSpend / 12).toFixed(2)); //average monthly spending
    const totalSpendTime = transactions
      .filter((y) => y.date < this.currDate)
      .reduce((sum, el) => (sum += el.duration!), 0); //total amount spent --> takes refunds into consideration
    const averageSpendTime = parseFloat((totalSpendTime / 12).toFixed(2)); //average monthly spending
    const monthDataArr = [];
    let facilityTimeArr = [];
    let facilityCostArr = [];
    for (let i = 0; i < 12; i++) {
      let mYear = this.currDate.getFullYear();
      const months = transactions.filter((d) => d.date.getMonth() == i);
      const monthTime = book.filter((d) => d.startDateTime.getMonth() == i);
      const ttl = -1 * months.reduce((sum, el) => (sum += el.amountChanged), 0);
      const ttlTime = monthTime.reduce(
        (sum, el) =>
          (sum +=
            (el.endDateTime.getTime() - el.startDateTime.getTime()) / 60000),
        0,
      );
      if (this.currDate.getMonth() < i) {
        mYear -= 1;
      }
      const facilityGroups = groupByAndSum(
        months,
        (t) => t.facilityId,
        "amountChanged",
      );
      const facilityMonthCost = await pushCostData(facilityGroups);
      const data: monthlyData = {
        month: this.monthNames[i],
        year: mYear,
        spending: ttl,
        time: ttlTime,
        coinsSpent: facilityMonthCost,
      };
      monthDataArr.push(data);
    }
    let facilityGroups = groupByAndSum(
      transactions,
      (t) => t.facilityId,
      "amountChanged",
    );
    facilityCostArr = await pushCostData(facilityGroups);
    facilityGroups = groupByAndSum(
      transactions.filter((y) => y.date),
      (t) => t.facilityId,
      "duration",
    );
    facilityTimeArr = await pushTimeData(facilityGroups);

    const analytics: userStats = {
      monthlySummary: {
        total: totalSpend,
        average: averageSpend,
        totalTime: totalSpendTime,
        averageTime: averageSpendTime,
      },
      monthlyData: monthDataArr,
      coinsSpent: facilityCostArr,
      timeScheduled: facilityTimeArr,
      //timeSpent:
    };
    return analytics;
  }

  public async providerAnalytics(id: number) {
    const availabilities = (
      await new AvailabilityService().getAvailabilityByFacilityID(id)
    ).filter((y) => y.startTime > this.year);
    const transactions = (
      await new TransactionService().getTransactionByFacilityID(id, this.query)
    )
      .filter((t) => t.transactionType !== "Refill")
      .filter((y) => y.date > this.year);
    const totalEarned =
      -1 * transactions.reduce((sum, el) => (sum += el.amountChanged), 0); //total amount spent --> takes refunds into consideration
    const averageEarned = parseFloat((totalEarned / 12).toFixed(2)); //average monthly spending
    const Booked = transactions.reduce((sum, el) => (sum += el.duration!), 0);
    const Unbooked = availabilities.reduce(
      (sum, el) =>
        (sum += (el.endTime.getTime() - el.startTime.getTime()) / 60000),
      0,
    );
    const monthDataArr = [];
    for (let i = 0; i < 12; i++) {
      let mYear = this.currDate.getFullYear();
      const months = transactions.filter((d) => d.date.getMonth() == i);
      const monthAvail = availabilities.filter(
        (d) => d.startTime.getMonth() == i,
      );
      const ttl = -1 * months.reduce((sum, el) => (sum += el.amountChanged), 0);
      const ttlBooked = months.reduce((sum, el) => (sum += el.duration!), 0);
      const ttlUnbooked = monthAvail.reduce(
        (sum, el) =>
          (sum += (el.endTime.getTime() - el.startTime.getTime()) / 60000),
        0,
      );
      if (this.currDate.getMonth() < i) {
        mYear -= 1;
      }
      const data: monthlyProviderData = {
        month: this.monthNames[i],
        year: mYear,
        totalBooked: ttlBooked,
        totalUnbooked: ttlUnbooked,
        earnings: ttl,
      };
      monthDataArr.push(data);
    }
    const facilityName = (await new FacilityService().getDeletedByID(id)).name;
    const analytics: providerStats = {
      monthlySummary: {
        name: facilityName,
        totalEarning: totalEarned,
        averageEarning: averageEarned,
        totalBooked: Booked,
        totalUnbooked: Unbooked,
      },
      monthlyData: monthDataArr,
    };
    return analytics;
  }
}

export default UserService;
