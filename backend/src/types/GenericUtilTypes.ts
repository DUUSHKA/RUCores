import { IsEnum, IsNumber, IsOptional, IsString, Max } from "class-validator";
import { QueryFailedError } from "typeorm";

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

class QueryError extends QueryFailedError {
  public errno: number;
}

export { GetAllQuery, Order, QueryError };
