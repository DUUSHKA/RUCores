import {
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { TransactionEntity } from "../database/Entities/transactionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import TransactionService from "../services/TransactionService";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { TransactionModel } from "../types/TransactionModel";

@JsonController("/transactions")
@OpenAPI(auth_errors)
export class TransactionController {
  service: TransactionService;
  constructor() {
    this.service = new TransactionService();
  }

  @Get("/getAll")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all transactions done by the current user",
  })
  @ResponseSchema(TransactionEntity, { isArray: true })
  async getAllTransactions(
    @CurrentUser() user: UserEntity,
    @QueryParams() query: GetAllQuery,
  ): Promise<TransactionEntity[]> {
    return this.service.getAllTransaction(user, query);
  }

  @Post("/createTransaction")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity, { isArray: true })
  async makeTransaction(
    @Body() transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    return this.service.createTransaction(transaction);
  }

  @Post("/balance")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity, { isArray: true })
  async changeBalance(
    @Body() transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    return this.service.changeBalance(transaction);
  }
}
