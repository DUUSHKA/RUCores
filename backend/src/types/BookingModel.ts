import { IsDate, IsNotEmpty } from "class-validator";

export class BookingModel {
  @IsNotEmpty()
  @IsDate()
  public startDateTime: Date;

  @IsNotEmpty()
  @IsDate()
  endDateTime: Date;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  availability_id: number;
}
