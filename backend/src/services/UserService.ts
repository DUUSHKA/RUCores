/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { ForbiddenError, UnauthorizedError } from "routing-controllers";
import { Repository } from "typeorm";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import { ProviderIDMapping } from "../types/ProviderUtilTypes";
import { UserModel } from "../types/UserModel";
import SessionService from "./SessionService";

class UserService {
  repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
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

  public async getOne(id: number): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id }); //parameter is automatically the where clause
    //because of findOneBy. Also keeping just id is the same as id : id
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public async getAll(): Promise<UserEntity[]> {
    return this.repository.find();
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
    const userToDelete = await this.repository
      .findOne({
        where: { id: id },
      })
      .catch((error) => {
        throw new Error(error);
      });
    if (!userToDelete) {
      throw new Error("User not found");
    }
    await this.repository.remove(userToDelete);
  }
}

export default UserService;
