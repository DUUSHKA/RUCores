/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEntity } from "../database/Entities/userEntity";

class UserService {
  public async createUser(user: UserEntity): Promise<UserEntity> {
    return {} as UserEntity;
    // ...
  }

  public async findUserByToken(token: string): Promise<UserEntity> {
    return {} as UserEntity;
    // ...
  }
}

export default UserService;
