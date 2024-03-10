import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
export enum TransactionType {
  Transfer = "Transfer",
  Refund = "Refund",
  Refill = "Refill",
}

export class TransactionModel {
  @IsNotEmpty()
  @IsNumber()
  amountChanged: number;

  @IsNotEmpty()
  @IsString()
  eventDescription: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsNumber()
  booking_id?: number;

  @IsOptional()
  @IsNumber()
  facility_id?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNotEmpty()
  @IsEnum({
    type: "simple-enum",
    enum: TransactionType,
    default: "Transfer",
  })
  transactionType: TransactionType;
}
