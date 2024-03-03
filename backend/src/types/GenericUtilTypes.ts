import { IsEnum, IsNumber, IsOptional, IsString, Max } from "class-validator";

enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

class GetAllQuery {
  @IsNumber()
  @Max(50)
  limit: number;

  @IsNumber()
  offset: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(Order)
  order?: Order;
}

export { GetAllQuery };
