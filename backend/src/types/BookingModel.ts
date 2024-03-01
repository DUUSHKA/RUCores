import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class BookingModel {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDateTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDateTime: Date;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  availability_id: number;
}
