/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from "express";
import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  Res,
} from "routing-controllers";
import { UserEntity } from "../database/Entities/userEntity";
import UserService from "../services/UserService";
import { UserModel } from "../types/UserModel";
import log from "../utils/logger";

@JsonController("/users")
export class UserController {
  @Get()
  @HttpCode(200)
  @Authorized(["admin"])
  async getAll(): Promise<UserEntity[]> {
    const allUsers = new UserService().getAll();
    log.debug("All users: ", allUsers);
    return allUsers;
  }

  @Get()
  @HttpCode(200)
  async getCurrent(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    log.debug("Current user: ", user);
    return user;
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    const user = new UserService().getOne(id);
    log.debug("All users: ", user);

    return "This action returns user #" + id;
  }

  @Post()
  @HttpCode(201)
  post(@Body() user: UserModel) {
    return "Saving user...";
  }

  @Post("/login")
  @HttpCode(200)
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
