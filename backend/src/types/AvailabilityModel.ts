import { IsDate, IsNotEmpty } from "class-validator";

export class AvailabilityModel {
  @IsNotEmpty()
  @IsDate()
  public Date: Date;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  endTime: Date;

  @IsNotEmpty()
  facility_id: number;
}
