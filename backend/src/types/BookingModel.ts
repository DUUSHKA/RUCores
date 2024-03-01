import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class BookingModel {
  @IsNotEmpty()
  @IsDateString()
  startDateTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endDateTime: Date;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  availability_id: number;
}
