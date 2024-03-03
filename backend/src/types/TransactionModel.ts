import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
  @IsString()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  facility_id: number;

  @IsNotEmpty()
  @IsNumber()
  booking_id: number;
}
