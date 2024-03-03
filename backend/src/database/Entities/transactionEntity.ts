import { Exclude, Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import { UserEntity } from "./userEntity";
export enum TransactionType {
  Transfer = "Transfer",
  Refund = "Refund",
  Refill = "Refill",
}

@Entity({ name: "transaction" })
export class TransactionEntity extends GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  eventDesription: string;

  @Column()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @Column()
  @IsNumber()
  amountChanged: number;

  @Column({
    type: "simple-enum",
    enum: TransactionType,
    default: "Transfer",
  })
  transactionType: TransactionType;

  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    eager: true,
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => FacilityEntity, (facility) => facility.transactions, {
    eager: true,
  })
  @JoinColumn()
  facility: FacilityEntity;

  @Exclude()
  getName = () => "Transaction";
}
