import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class BookingModel {
  @IsNotEmpty()
  @IsDate()
  startDateTime: Date;

  @IsNotEmpty()
  @IsDate()
  endDateTime: Date;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  availability_id: number;
}
