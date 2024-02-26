/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import FacilityService from "../services/FacilityService";
import { FacilityModel } from "../types/FacilityModel";

@JsonController("/facility")
@OpenAPI({
  security: [{ cookieAuth: [] }],
})
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
  async getAll(): Promise<FacilityEntity[]> {
    return this.service.getAll();
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
  put(
    @Param("id") id: number,
    @Body() facility: FacilityModel,
  ): Promise<FacilityEntity> {
    return this.service.updateFacility(id, facility);
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete a facility, requires provider role",
  })
  @Authorized(["provider"])
  remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    return this.service.deleteFacility(user, id);
  }
}

export default FacilityController;
