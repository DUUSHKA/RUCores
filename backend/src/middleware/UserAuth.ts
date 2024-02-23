import { Action, ForbiddenError } from "routing-controllers";
import UserService from "../services/UserService";
import log from "../utils/logger";
import { UserEntity } from "../database/Entities/userEntity";

export async function verifyUser(
  action: Action,
  roles: string[],
): Promise<boolean> {
  const userService = new UserService();
  const token = action.request.headers["authorization"];
  if (!token) {
    throw new ForbiddenError("No token provided");
  }

  const user = await userService.findUserByToken(token);
  log.debug("User: ", user.id);
  log.debug("Roles: ", roles);
  // for (const role of roles) {
  //     if (!user.roles.includes(role)) {
  //         return false;
  //     }
  // }
  return true;
}

export async function fetchUser(action: Action): Promise<UserEntity> {
  const userService = new UserService();
  const token = action.request.headers["authorization"];
  const user = await userService.findUserByToken(token);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
