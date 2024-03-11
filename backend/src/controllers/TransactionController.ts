/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
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

  @Get("/transactionID/:id")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity)
  getOne(@Param("id") id: number) {
    const avail = this.service.getOneByID(id);
    return avail;
  }

  /*   @Get("/facility/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all availabilities scheduled for the facility",
  })
  @ResponseSchema(TransactionEntity, { isArray: true })
  get(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    transaction: TransactionModel,
  ) {
    //: Promise<TransactionEntity[]>
    //return this.service.getTransactionByFacilityID(id);
  } */

  //endpoint should not be called EVER only here for testing purposes
  @Post("/create")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity, { isArray: true })
  async makeTransaction(
    @Body() transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    return this.service.createTransaction(transaction);
  }

  /*   @Post("/refillBalance")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity, { isArray: true })
  async changeBalance(
    @Body() transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    const create = this.service.createTransaction(transaction);
    return this.service.changeBalance(transaction);
  } */

  //endpoint should not be called EVER only here for testing purposes
  @Delete("/:id")
  remove(@Param("id") id: number) {
    const deletedUTransaction = this.service.deleteTransaction(id);
    return "Removed transaction successfully.";
  }
}
