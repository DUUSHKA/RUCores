import cookie from "cookie";
import { Action, ForbiddenError, UnauthorizedError } from "routing-controllers";
import { UserEntity } from "../database/Entities/userEntity";
import SessionService from "../services/SessionService";
import log from "../utils/logger";

export async function verifyUser(
  action: Action,
  roles: string[],
): Promise<boolean> {
  const sessionService = new SessionService();
  const cookies = cookie.parse(action.request.headers.cookie ?? "");
  const token = cookies["session"];
  log.silly(`Found token: [${token}] in cookies`);
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  const session = await sessionService.findSessionByToken(token);
  if (!session) {
    throw new ForbiddenError("Invalid token");
  }
  if (!session.user) {
    sessionService.delete(session.id);
    throw new ForbiddenError("No user found in session");
  }
  if (!session.user.roles && roles.length !== 0) {
    throw new ForbiddenError("User has no roles");
  }
  log.silly(`User has roles: [${session.user.roles}]`);
  for (const role of roles) {
    if (!session.user.roles.includes(role)) {
      throw new ForbiddenError("User does not have the required roles");
    }
  }
  return true;
}

export async function fetchUser(action: Action): Promise<UserEntity> {
  const sessionService = new SessionService();
  const cookies = cookie.parse(action.request.headers.cookie || "");
  const token = cookies["session"];
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }
  const session = await sessionService.findSessionByToken(token);
  if (!session) {
    throw new ForbiddenError("Invalid token");
  }
  return session.user;
}
