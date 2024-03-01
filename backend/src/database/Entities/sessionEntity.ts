import { Exclude, Type } from "class-transformer";
import { IsDate, IsString, ValidateNested } from "class-validator";
import crypto from "crypto";
import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import GenericEntity from "./genericEntity";
import { UserEntity } from "./userEntity";

@Entity({ name: "session", schema: "rucores" })
export class SessionEntity extends GenericEntity {
  @ManyToOne(() => UserEntity, (user) => user.sessions)
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

  @Exclude()
  getName = () => "Session";
}
