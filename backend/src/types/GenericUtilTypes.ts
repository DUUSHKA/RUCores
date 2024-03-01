import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

class GetAllQuery {
  @IsNumber()
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
