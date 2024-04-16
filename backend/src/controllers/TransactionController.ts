import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  ForbiddenError,
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
import FacilityService from "../services/FacilityService";
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
  async getOne(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    const transact = this.service.getOneByID(id);
    if (
      user.roles.includes("admin") ||
      (await user.transactions).includes(await transact)
    ) {
      return transact;
    }
    throw new ForbiddenError(
      "user is not the owner of the transaction or an admin",
    );
  }

  @Get("/facilityID/:id")
  @HttpCode(200)
  @Authorized(["provider"])
  @ResponseSchema(TransactionEntity)
  async getfacility(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @QueryParams() query: GetAllQuery,
  ) {
    const facility = await new FacilityService().getOneByID(id);
    if (
      (await user.managedFacilities).includes(facility) ||
      user.roles.includes("admin")
    ) {
      return this.service.getTransactionByFacilityID(id, query);
    }
    throw new ForbiddenError(
      "user is not a provider for the facility or an admin",
    );
  }

  //endpoint should not be called EVER only here for testing purposes
  @Post("/create")
  @HttpCode(200)
  @ResponseSchema(TransactionEntity, { isArray: true })
  async makeTransaction(
    @Body() transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    return this.service.createTransaction(transaction);
  }

  //endpoint should not be called EVER only here for testing purposes
  @Delete("/:id")
  remove(@Param("id") id: number) {
    return this.service.deleteTransaction(id);
  }
}
