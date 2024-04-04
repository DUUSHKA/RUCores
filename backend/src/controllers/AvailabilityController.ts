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
  get(@Param("id") id: number): Promise<AvailabilityEntity[]> {
    return this.service.getAvailabilityByFacilityID(id);
  }

  @Get("/availabilityID/:id")
  @HttpCode(200)
  @ResponseSchema(AvailabilityEntity)
  getOne(@Param("id") id: number) {
    const avail = this.service.getOneByID(id);
    return avail;
  }

  @Get("/deleted/availabilityID/:id")
  @HttpCode(200)
  @ResponseSchema(AvailabilityEntity)
  getOneDeleted(@Param("id") id: number) {
    const avail = this.service.getDeletedByID(id);
    return avail;
  }

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
    if (user.roles.includes("Provider") || user.roles.includes("admin")) {
      return this.service.createAvailability(user, availability);
    }
    throw new ForbiddenError("user is not a provider account or an admin");
  }

  @Put("/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Update an availibility by ID",
  })
  @ResponseSchema(AvailabilityEntity)
  async put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    const old = this.service.getOneByID(id);
    if (
      (await user.managedFacilities).includes(await (await old).facility) ||
      user.roles.includes("admin")
    ) {
      return this.service.updateAvailability(user, id, availability);
    }
    throw new ForbiddenError(
      "User is not the provider for the availability or an admin",
    );
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete an availability",
  })
  @OnUndefined(204)
  async remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    const old = this.service.getOneByID(id);
    if (
      (await user.managedFacilities).includes(await (await old).facility) ||
      user.roles.includes("admin")
    ) {
      return this.service.deleteAvailability(user, id);
    }
    throw new ForbiddenError(
      "User is not the provider for the availability or an admin",
    );
  }
}

export default AvailabilityController;
