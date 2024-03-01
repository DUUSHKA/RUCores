/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { AvailabilityEntity } from "../database/Entities/availabilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import AvailabilityService from "../services/AvailabilityService";
import { AvailabilityModel } from "../types/AvailabilityModel";

@JsonController("/availability")
@OpenAPI(auth_errors)
@Authorized()
export class AvailabilityController {
  service: AvailabilityService;

  constructor() {
    this.service = new AvailabilityService();
  }

  @Get("/facility/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all availabilities scheduled for the facility",
  })
  @ResponseSchema(AvailabilityEntity, { isArray: true })
  get(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity[]> {
    return this.service.getAvailabilityByFacilityID(id);
  }
  // async getManaged(@CurrentUser() user: UserEntity): Promise<AvailabilityEntity[]> {
  //     @Param("id") id: number,
  //   return this.service.
  // }

  // Not sure how to implement this --> giving me errors on duplicate function
  /*     @Get("/:id")
    @HttpCode(200)
    @OpenAPI({
      summary: "Get availability by id",
    })
    @ResponseSchema(AvailabilityEntity, { isArray: true })
    get(
        @CurrentUser() user: UserEntity,
        @Param("id") id: number,
        @Body({
          validate: { forbidUnknownValues: true, skipMissingProperties: true },
        })
        availability: AvailabilityModel,
      ): Promise<AvailabilityEntity> {
        return this.service.getAvailabilityByID(id);
      } */

  @Post()
  @HttpCode(201)
  @OpenAPI({
    summary: "Create a new availability",
  })
  @ResponseSchema(AvailabilityEntity)
  post(
    @CurrentUser() user: UserEntity,
    @Body() availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    return this.service.createAvailability(user, availability);
  }

  @Put("/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Update an availibility by ID",
  })
  @ResponseSchema(AvailabilityEntity)
  put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    return this.service.updateAvailability(user, id, availability);
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete an availability",
  })
  @OnUndefined(204)
  remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    return this.service.deleteAvailability(user, id);
  }
}

export default AvailabilityController;
