/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { ForbiddenError, UnauthorizedError } from "routing-controllers";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { ProviderIDMapping } from "../types/ProviderUtilTypes";
import { UserModel } from "../types/UserModel";
import BookingService from "./BookingService";
import GenericService from "./GenericService";
import SessionService from "./SessionService";

class UserService extends GenericService<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  private hashPassword(password: string, user: UserEntity): string {
    const hmac = crypto.createHmac("sha256", user.salt);
    return hmac.update(password).digest("hex");
  }

  public async createUser(user: UserModel): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.salt = crypto.randomBytes(16).toString("hex");
    newUser.hashedPassword = this.hashPassword(user.password, newUser);
    newUser.roles = ["user"];
    return this.repository.save(newUser);
  }
  public async createProvider(provider: UserModel): Promise<UserEntity> {
    if (provider.isProvider === false) {
      throw new ForbiddenError("User is not a provider");
    }
    const providerEntity = new UserEntity();
    providerEntity.firstName = provider.firstName;
    providerEntity.lastName = provider.lastName;
    providerEntity.username = provider.username;
    providerEntity.email = provider.email;
    providerEntity.salt = crypto.randomBytes(16).toString("hex");
    providerEntity.hashedPassword = this.hashPassword(
      provider.password,
      providerEntity,
    );
    providerEntity.roles = ["provider"];
    providerEntity.isProvider = true;
    return this.repository.save(providerEntity);
  }

  public async getAllByID(ids: number[]): Promise<UserEntity[]> {
    if (ids.length === 0) return [];
    return this.repository.find({
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

  public async getAllProviderIDs(): Promise<ProviderIDMapping[]> {
    const providers = await this.repository.find({
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
    if (user.hashedPassword !== this.hashPassword(password, user)) {
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
      userToUpdate,
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
}

export default UserService;
