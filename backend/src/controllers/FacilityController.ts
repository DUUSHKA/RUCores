/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import FacilityService from "../services/FacilityService";
import { FacilityModel } from "../types/FacilityModel";
import { GetAllQuery } from "../types/GenericUtilTypes";

@JsonController("/facility")
@OpenAPI(auth_errors)
@Authorized()
export class FacilityController {
  service: FacilityService;

  constructor() {
    this.service = new FacilityService();
  }

  @Get()
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all facilities",
  })
  @ResponseSchema(FacilityEntity, { isArray: true })
  async getAll(@QueryParams() query: GetAllQuery): Promise<FacilityEntity[]> {
    return this.service.getAll(query);
  }

  @Get()
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all facilities including deleted facilities",
  })
  @ResponseSchema(FacilityEntity, { isArray: true })
  async getAllWithDeleted(
    @QueryParams() query: GetAllQuery,
  ): Promise<FacilityEntity[]> {
    return this.service.getAllWithDeleted(query);
  }

  @Get()
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all deleted facilities",
  })
  @ResponseSchema(FacilityEntity, { isArray: true })
  async getDeleted(
    @QueryParams() query: GetAllQuery,
  ): Promise<FacilityEntity[]> {
    return this.service.getDeleted(query);
  }

  @Get("/facilityID/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get facility by ID",
  })
  @ResponseSchema(FacilityEntity)
  getOne(@Param("id") id: number) {
    const facility = this.service.getOneByID(id);
    return facility;
  }

  @Get("/deleted/facilityID/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get deleted facilities by ID",
  })
  @ResponseSchema(FacilityEntity)
  getOneDeleted(@Param("id") id: number) {
    const facility = this.service.getDeletedByID(id);
    return facility;
  }

  @Get("/managed")
  @HttpCode(200)
  @Authorized(["provider"])
  @OpenAPI({
    summary: "Get all facilities managed by the current user",
  })
  @ResponseSchema(FacilityEntity, { isArray: true })
  async getManaged(@CurrentUser() user: UserEntity): Promise<FacilityEntity[]> {
    return user.managedFacilities;
  }

  @Post()
  @HttpCode(201)
  @Authorized(["provider"])
  @OpenAPI({
    summary: "Create a new facility, requires provider role",
  })
  @ResponseSchema(FacilityEntity)
  post(
    @CurrentUser() user: UserEntity,
    @Body() facility: FacilityModel,
  ): Promise<FacilityEntity> {
    const providers = facility.providers;
    if (!providers.includes(user.id)) {
      providers.push(user.id);
    }
    return this.service.createFacility(facility);
  }

  @Put("/:id")
  @HttpCode(200)
  @Authorized(["provider"])
  @OpenAPI({
    summary: "Update a facility, requires provider role",
  })
  @ResponseSchema(FacilityEntity)
  async put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    facility: FacilityModel,
  ): Promise<FacilityEntity> {
    const managedFacilityIDs = (await user.managedFacilities).map(
      (facility: FacilityEntity) => facility.id,
    );

    if (managedFacilityIDs.includes(id) || user.roles.includes("admin")) {
      return this.service.updateFacility(id, facility);
    }
    throw new ForbiddenError("Not a provider for this facility");
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete a facility, requires provider role",
  })
  @Authorized(["provider"])
  @OnUndefined(204)
  remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    return this.service.deleteFacility(user, id);
  }
}

export default FacilityController;
