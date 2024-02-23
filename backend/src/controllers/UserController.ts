/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  Authorized,
  CurrentUser,
  HttpCode,
} from "routing-controllers";
import { UserModel } from "../types/UserModel";
import { UserEntity } from "../database/Entities/userEntity";
import log from "../utils/logger";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

@JsonController("/users")
@Authorized()
export class UserController {
  @Get()
  @HttpCode(200)
  @Authorized(["admin"])
  async getAll(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    log.debug("Current user: ", user);
    return user;
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return "This action returns user #" + id;
  }

  @Post()
  @HttpCode(201)
  post(@Body() user: UserModel) {
    return "Saving user...";
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
