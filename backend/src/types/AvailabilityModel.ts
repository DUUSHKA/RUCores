import { IsNotEmpty } from "class-validator";
import { FacilityModel } from "./FacilityModel";

export class AvailabilityModel {
  @IsNotEmpty()
  public Date: Date;

  @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  endTime: Date;

  facility: FacilityModel;
}
