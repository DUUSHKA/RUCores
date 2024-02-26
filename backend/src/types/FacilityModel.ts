import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FacilityModel {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  providerID: number[];
  //Other wise use the logged in user to create the facility
}
