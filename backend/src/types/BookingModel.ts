import { IsNotEmpty } from "class-validator";
import { AvailabilityModel } from "./AvailabilityModel";
import { UserModel } from "./UserModel";

export class BookingModel {
  @IsNotEmpty()
  public startDateTime: Date;

  @IsNotEmpty()
  endDateTime: Date;

  user: UserModel;

  availability: AvailabilityModel;
}
