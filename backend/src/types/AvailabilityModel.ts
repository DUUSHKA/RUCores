import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class AvailabilityModel {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  Date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsNotEmpty()
  @IsNumber()
  facility_id: number;
}
