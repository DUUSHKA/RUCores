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
  startDateTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDateTime: Date;

  @IsNotEmpty()
  @IsNumber()
  facility_id: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
