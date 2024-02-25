import { Exclude } from "class-transformer";
import crypto from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./userEntity";

@Entity({ name: "session" })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    eager: true,
  })
  user: UserEntity;

  @Column()
  token: string;

  @Column()
  expiration: Date;

  @BeforeInsert()
  setExpiration() {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    this.expiration = now;
  }

  @BeforeInsert()
  setToken() {
    this.token = crypto.randomBytes(32).toString("hex");
  }
}
