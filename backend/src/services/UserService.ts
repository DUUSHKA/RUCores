/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { ForbiddenError, UnauthorizedError } from "routing-controllers";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { ProviderIDMapping } from "../types/ProviderUtilTypes";
import { TransactionModel, TransactionType } from "../types/TransactionModel";
import { UserModel } from "../types/UserModel";
import AvailabilityService from "./AvailabilityService";
import BookingService from "./BookingService";
import FacilityService from "./FacilityService";
import GenericService from "./GenericService";
import SessionService from "./SessionService";
import TransactionService from "./TransactionService";

type monthlyData = {
  month: string;
  year: number;
  spending: number;
  time: number; //total time spent in a facility that month
};

type coinsByFacility = {
  facility: string;
  coins: number;
};

type timeByFacility = {
  facility: string;
  time: number; //In minutes
};

type userStats = {
  monthlySummary: {
    total: number;
    average: number;
    totalTime: number; //total time spent in facilities
    averageTime: number; //average time spent in facilities each month
  };
  monthlyData: monthlyData[];
  coinsSpent: coinsByFacility[]; //total coins spent per facility in the past 12 months
  timeSscheduled: timeByFacility[]; //total time scheduled within the last 12 months
  //timeSpent: timeByFacility[]
};

type monthlyProviderData = {
  month: string;
  year: number;
  earnings: number;
  totalUnbooked: number;
  totalBooked: number;
};

type providerStats = {
  monthlySummary: {
    name: string;
    totalEarning: number;
    averageEarning: number;
    totalUnbooked: number;
    totalBooked: number;
  };
  monthlyData: monthlyProviderData[];
};

type GroupedWithSum<T> = Record<number, { items: T[]; sum: number }>;

class UserService extends GenericService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  public groupByAndSum<T>(
    array: T[],
    keyGetter: (item: T) => number,
    sumProperty: keyof T,
  ): GroupedWithSum<T> {
    return array.reduce((result: GroupedWithSum<T>, item: T) => {
      const key = keyGetter(item);
      if (!result[key]) {
        result[key] = { items: [], sum: 0 };
      }
      result[key].items.push(item);
      result[key].sum += item[sumProperty] as number;
      return result;
    }, {});
  }

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
    return this.repository.save(newUser);
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
  public async addBalance(id: number, amount: number): Promise<UserEntity> {
    const transact = await new TransactionService();
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    user.balance += amount;
    const transaction: TransactionModel = {
      amountChanged: amount,
      eventDescription: "balance refill",
      date: new Date(),
      user_id: id,
      transactionType: TransactionType.Refill,
    };
    transact.createTransaction(transaction);
    return this.repository.save(user);
  }

  public async userAnalytics(id: number) {
    const query: GetAllQuery = {
      limit: 10000,
      offset: 0,
    };
    const currDate = new Date();
    const year = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const monthNames = [
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
    const user = await this.getOneByID(id);
    const book = (await new BookingService().getBookings(user, query)).filter(
      (y) => y.startDateTime > year && y.startDateTime < currDate,
    );
    const transactions = (
      await new TransactionService().getAllTransaction(user, query)
    )
      .filter((t) => t.transactionType !== "Refill")
      .filter((y) => y.date > year);
    const totalSpend =
      -1 * transactions.reduce((sum, el) => (sum += el.amountChanged), 0); //total amount spent --> takes refunds into consideration
    const averageSpend = parseFloat((totalSpend / 12).toFixed(2)); //average monthly spending
    const totalSpendTime = transactions
      .filter((y) => y.date < currDate)
      .reduce((sum, el) => (sum += el.duration!), 0); //total amount spent --> takes refunds into consideration
    const averageSpendTime = parseFloat((totalSpendTime / 12).toFixed(2)); //average monthly spending
    const monthDataArr = [];
    for (let i = 0; i < 12; i++) {
      let mYear = currDate.getFullYear();
      const months = transactions.filter((d) => d.date.getMonth() == i);
      const monthTime = book.filter((d) => d.startDateTime.getMonth() == i);
      const ttl = -1 * months.reduce((sum, el) => (sum += el.amountChanged), 0);
      const ttlTime = monthTime.reduce(
        (sum, el) =>
          (sum +=
            (el.endDateTime.getTime() - el.startDateTime.getTime()) / 60000),
        0,
      );
      if (currDate.getMonth() < i) {
        mYear -= 1;
      }
      const data: monthlyData = {
        month: monthNames[i],
        year: mYear,
        spending: ttl,
        time: ttlTime,
      };
      const x = monthDataArr.push(data);
    }
    let facilityGroups = this.groupByAndSum(
      transactions,
      (t) => t.facility?.id!,
      "amountChanged",
    );
    const facilityCostArr = [];
    const facilityTimeArr = [];
    const facilityTimeSpentArr = [];
    for (const key in facilityGroups) {
      if (Object.prototype.hasOwnProperty.call(facilityGroups, key)) {
        const group = facilityGroups[key];
        const sum = -1 * group.sum;
        const data: coinsByFacility = {
          facility: (await new FacilityService().getOneByID(Number(key))).name,
          coins: sum,
        };
        const x = facilityCostArr.push(data);
      }
    }
    facilityGroups = this.groupByAndSum(
      transactions.filter((y) => y.date),
      (t) => t.facility?.id!,
      "duration",
    );
    for (const key in facilityGroups) {
      if (Object.prototype.hasOwnProperty.call(facilityGroups, key)) {
        const group = facilityGroups[key];
        const sum = group.sum;
        const data: timeByFacility = {
          facility: (await new FacilityService().getOneByID(Number(key))).name,
          time: sum,
        };
        const x = facilityTimeArr.push(data);
      }
    }
    //facilityGroups = book.filter()

    const analytics: userStats = {
      monthlySummary: {
        total: totalSpend,
        average: averageSpend,
        totalTime: totalSpendTime,
        averageTime: averageSpendTime,
      },
      monthlyData: monthDataArr,
      coinsSpent: facilityCostArr,
      timeSscheduled: facilityTimeArr,
      //timeSpent:
    };
    return analytics;
  }

  public async providerAnalytics(id: number) {
    const query: GetAllQuery = {
      limit: 10000,
      offset: 0,
    };
    const currDate = new Date();
    const year = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const monthNames = [
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
    const transactions = (
      await new TransactionService().getTransactionByFacilityID(id, query)
    )
      .filter((t) => t.transactionType !== "Refill")
      .filter((y) => y.date > year);
    console.log("after filters");
    const availabilities = (
      await new AvailabilityService().getAvailabilityByFacilityID(id)
    ).filter((y) => y.startTime > year);
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
    console.log("before for");
    for (let i = 0; i < 12; i++) {
      let mYear = currDate.getFullYear();
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
      if (currDate.getMonth() < i) {
        mYear -= 1;
      }
      console.log("before setting JSON");
      const data: monthlyProviderData = {
        month: monthNames[i],
        year: mYear,
        totalBooked: ttlBooked,
        totalUnbooked: ttlUnbooked,
        earnings: ttl,
      };
      const x = monthDataArr.push(data);
    }
    const facilityName = (await new FacilityService().getOneByID(id)).name;
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
