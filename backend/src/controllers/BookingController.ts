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
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import BookingService from "../services/BookingService";
import { BookingModel } from "../types/BookingModel";

@JsonController("/booking")
@OpenAPI(auth_errors)
@Authorized()
export class BookingController {
  service: BookingService;

  constructor() {
    this.service = new BookingService();
  }

  @Get("/scheduled")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all bookings scheduled by the current user",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  async getManaged(@CurrentUser() user: UserEntity): Promise<BookingEntity[]> {
    return user.bookings;
  }

  @Post()
  @HttpCode(201)
  @OpenAPI({
    summary: "Create a new booking",
  })
  @ResponseSchema(BookingEntity)
  post(
    @CurrentUser() user: UserEntity,
    @Body() booking: BookingModel,
  ): Promise<BookingEntity> {
    return this.service.createBooking(user, booking);
  }

  @Put("/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Update a booking",
  })
  @ResponseSchema(BookingEntity)
  put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    booking: BookingModel,
  ): Promise<BookingEntity> {
    return this.service.updateBooking(user, id, booking);
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete a booking",
  })
  @OnUndefined(204)
  remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    return this.service.deleteBooking(user, id);
  }
}

export default BookingController;
