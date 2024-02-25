/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { ForbiddenError, UnauthorizedError } from "routing-controllers";
import { Repository } from "typeorm";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
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

  public async createUser(user: UserEntity): Promise<UserEntity> {
    return {} as UserEntity;
    // ...
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
}

export default UserService;
