import { Exclude, Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import { UserEntity } from "./userEntity";
export enum TransactionType {
  Transfer = "Transfer",
  Refund = "Refund",
  Refill = "Refill",
}

@Entity({ name: "transaction", schema: "rucores" })
export class TransactionEntity extends GenericEntity {
  // @PrimaryGeneratedColumn()
  // id: number;
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

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  duration?: number;

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
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  facility?: FacilityEntity;

  @ManyToOne(() => BookingEntity, (booking) => booking.transactions, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  booking?: BookingEntity;

  @Exclude()
  getName = () => "Transaction";
}
