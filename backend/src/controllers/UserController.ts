/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from "express";
import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  Res,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import UserService from "../services/UserService";
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
  @Get()
  @HttpCode(200)
  @Authorized(["admin"])
  @ResponseSchema(UserEntity, { isArray: true })
  async getAll(): Promise<UserEntity[]> {
    const allUsers = this.service.getAll();
    log.debug("All users: ", allUsers);
    return allUsers;
  }

  @Get()
  @HttpCode(200)
  @ResponseSchema(UserEntity)
  async getCurrent(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    log.debug("Current user: ", user);
    return user;
  }

  @Get("/:id")
  @HttpCode(200)
  @ResponseSchema(UserEntity)
  getOne(@Param("id") id: number) {
    const user = this.service.getOne(id);
    log.debug(" user found by ID: ", user);
    return user;
  }

  @Get("/providers")
  @Authorized(["provider"])
  @HttpCode(200)
  @ResponseSchema(ProviderIDMapping, { isArray: true })
  async getProviders(
    @CurrentUser() user: UserEntity,
  ): Promise<ProviderIDMapping[]> {
    if (user.isProvider === false) {
      throw new ForbiddenError("User is not a provider");
    }
    const providers = this.service.getAllProviderIDs();
    log.debug("All providers: ", providers);
    return providers;
  }

  @Post()
  @HttpCode(201)
  @ResponseSchema(UserEntity)
  post(@Body() user: UserModel) {
    const newUser = this.service.createUser(user);
    log.debug("New user created: ", newUser);
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
    @BodyParam("username") username: string,
    @BodyParam("password") password: string,
    @Res() response: Response,
  ) {
    const userService = new UserService();
    const session = await userService.login(username, password);
    response.cookie("session", session.token);
    log.debug(`Logged in as ${username}`);
    log.silly(`Session token: ${session.token}`);
    return session.user;
  }

  @Put("/:id")
  put(@Param("id") id: number, @Body() user: UserModel) {
    return "Updating a user...";
  }

  @Delete("/:id")
  remove(@Param("id") id: number) {
    return "Removing user...";
  }
}
