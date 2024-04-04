import { Response } from "express";
import {
  Authorized,
  Body,
  BodyParam,
  CookieParam,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
  Res,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import UserService from "../services/UserService";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { ProviderIDMapping } from "../types/ProviderUtilTypes";
import { UserModel } from "../types/UserModel";
import log from "../utils/logger";

@JsonController("/users")
@OpenAPI(auth_errors)
export class UserController {
  service: UserService;

  constructor() {
    this.service = new UserService();
  }
  @Get("/getAll")
  @HttpCode(200)
  @Authorized(["admin"])
  @ResponseSchema(UserEntity, { isArray: true })
  async getAll(@QueryParams() query: GetAllQuery): Promise<UserEntity[]> {
    const allUsers = this.service.getAll(query);
    //log.debug("All users: ", allUsers);
    return allUsers;
  }
  @Get("/getAllWithDeleted")
  @HttpCode(200)
  @Authorized(["admin"])
  @ResponseSchema(UserEntity, { isArray: true })
  async getAllWithDeleted(
    @QueryParams() query: GetAllQuery,
  ): Promise<UserEntity[]> {
    const allUsers = this.service.getAllWithDeleted(query);
    log.debug("All users: ", allUsers);
    return allUsers;
  }

  @Get("/getAllDeleted")
  @HttpCode(200)
  @Authorized(["admin"])
  @ResponseSchema(UserEntity, { isArray: true })
  async getAllDeleted(
    @QueryParams() query: GetAllQuery,
  ): Promise<UserEntity[]> {
    const allUsers = this.service.getDeleted(query);
    log.debug("All users: ", allUsers);
    return allUsers;
  }

  @Get()
  @HttpCode(200)
  @ResponseSchema(UserEntity)
  async getCurrent(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Get("/analytics")
  @HttpCode(200)
  async getUserStats(@CurrentUser() user: UserEntity) {
    return this.service.userAnalytics(user);
  }

  @Get("/providerAnalytics/:id")
  @Authorized(["provider"])
  @HttpCode(200)
  async getProviderStats(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
  ) {
    let managedFacilityIDs = (await user.managedFacilities).map(
      (facility: FacilityEntity) => facility.id,
    );
    //append past managed facilities of the user to this array
    if (user.pastManagedFacilities) {
      managedFacilityIDs = [
        ...managedFacilityIDs,
        ...user.pastManagedFacilities.map(Number),
      ];
    }

    if (managedFacilityIDs.includes(id) && user.roles.includes("provider")) {
      return this.service.providerAnalytics(id);
    }
    throw new ForbiddenError("Not a provider for this facility");
  }

  @Get("/userID/:id")
  @HttpCode(200)
  @ResponseSchema(UserEntity)
  getOne(@Param("id") id: number) {
    const user = this.service.getOneByID(id);
    //log.debug(" user found by ID: ", user);
    return user;
  }

  @Get("/deleted/userID/:id")
  @HttpCode(200)
  @Authorized(["admin"])
  @ResponseSchema(UserEntity)
  getOneDeleted(@Param("id") id: number) {
    const user = this.service.getDeletedByID(id);
    //log.debug(" user found by ID: ", user);
    return user;
  }

  @Get("/providers")
  @Authorized(["provider"])
  @HttpCode(200)
  @ResponseSchema(ProviderIDMapping, { isArray: true })
  async getProviders(
    @CurrentUser() user: UserEntity,
  ): Promise<ProviderIDMapping[]> {
    if (user.isProvider === false || user.roles.includes("admin")) {
      throw new ForbiddenError("User is not a provider or an admin");
    }
    const providers = this.service.getAllProviderIDs();
    //log.debug("All providers: ", providers);
    return providers;
  }

  @Post()
  @HttpCode(201)
  @ResponseSchema(UserEntity)
  post(@Body() user: UserModel) {
    const newUser = this.service.createUser(user);
    //log.debug("New user created: ", newUser);
    return newUser;
  }

  @Post("/login")
  @HttpCode(200)
  @OpenAPI({
    description: "Logs in a user and sets a session cookie",
    responses: {
      "200": {
        description: "User logged in",
        headers: {
          "Set-Cookie": {
            schema: {
              type: "string",
              example: "session=abc",
            },
          },
        },
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/UserEntity",
                },
              },
            },
          },
        },
      },
    },
  })
  @ResponseSchema(UserEntity)
  async login(
    @BodyParam("username", { required: true }) username: string,
    @BodyParam("password", { required: true }) password: string,
    @Res() response: Response,
  ) {
    const userService = new UserService();
    const session = await userService.login(username, password);
    response.cookie("session", session.token);
    return session.user;
  }

  @Post("/refillBalance/:id")
  @HttpCode(200)
  async changeBalance(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @BodyParam("refill", { required: true }) refill: number,
  ) {
    if (id == user.id || user.roles.includes("admin")) {
      return this.service.addBalance(user, refill);
    }
    throw new ForbiddenError(
      "User is trying to refill another user's balance or is not an admin",
    );
  }

  @Put("/userID/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Update a user",
  })
  @ResponseSchema(UserEntity)
  async put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    newUser: UserModel,
  ): Promise<UserEntity> {
    if (id == user.id || user.roles.includes("admin")) {
      return this.service.updateUser(id, newUser);
    }
    throw new ForbiddenError(
      "User is trying to change another user's information or is not an admin",
    );
  }

  @Delete("/userID/:id")
  remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    if (id == user.id || user.roles.includes("admin")) {
      return this.service.deleteUser(id);
    }
    throw new ForbiddenError(
      "User is trying to delete another user or is not an admin",
    );
  }

  @Delete("/logout")
  logout(@CookieParam("session") token: string) {
    return this.service.logout(token);
  }
}
