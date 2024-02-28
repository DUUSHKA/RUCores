import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class AvailabilityModel {
  @IsNotEmpty()
  @IsDate()
  Date: Date;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  endTime: Date;

  @IsNotEmpty()
  @IsNumber()
  facility_id: number;
}
