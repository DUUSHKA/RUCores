import { Exclude, Type } from "class-transformer";
import { IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import crypto from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./userEntity";

@Entity({ name: "session", schema: "rucores" })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  @IsNumber()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    eager: true,
  })
  @ValidateNested()
  @Type(() => UserEntity)
  user: UserEntity;

  @Column()
  @IsString()
  token: string;

  @Column()
  @IsDate()
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
