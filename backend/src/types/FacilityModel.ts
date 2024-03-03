import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FacilityModel {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  providers: number[];
  //Other wise use the logged in user to create the facility
}
