import { Repository } from "typeorm";
import { SessionEntity } from "../database/Entities/sessionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import log from "../utils/logger";

class SessionService {
  repository: Repository<SessionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(SessionEntity);
  }

  public async createSession(user: UserEntity): Promise<SessionEntity> {
    const session = new SessionEntity();
    session.user = user;
    return this.repository.save(session);
  }

  public async findSessionByToken(
    token: string,
  ): Promise<SessionEntity | null> {
    log.debug(`Searching for session with token: [${token}]`);
    const session = await this.repository.findOneBy({ token });
    if (!session) {
      log.debug(`No session found with token: [${token}]`);
      return null;
    }
    if (session.expiration < new Date()) {
      await this.repository.remove(session);
      return null;
    } else return session;
  }

  public async cleanSessions(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where("expiration < :now", { now: new Date() })
      .execute();
  }
}

export default SessionService;
