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
  QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import BookingService from "../services/BookingService";
import FacilityService from "../services/FacilityService";
import { BookingModel } from "../types/BookingModel";
import { GetAllQuery } from "../types/GenericUtilTypes";

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
  async getBooked(
    @CurrentUser() user: UserEntity,
    @QueryParams() query: GetAllQuery,
  ): Promise<BookingEntity[]> {
    return this.service.getBookings(user, query);
  }

  @Get("/bookingID/:id")
  @HttpCode(200)
  @ResponseSchema(BookingEntity)
  async getOne(@Param("id") id: number) {
    const booking = await this.service.getOneByID(id);
    const availability = await booking.availability;
    await availability.facility;
    return booking;
  }

  @Get("/deleted/bookingID/:id")
  @HttpCode(200)
  @ResponseSchema(BookingEntity)
  getOneDeleted(@Param("id") id: number) {
    const booking = this.service.getDeletedByID(id);
    return booking;
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

  @Get("/availabilityID/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all bookings for an availability",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  getBookingsByAvailability(@Param("id") id: number): Promise<BookingEntity[]> {
    return this.service.getBookingsForAvailability(id);
  }

  @Get("/futureFacility/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all future bookings for a facility",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  async getFuture(@Param("id") id: number): Promise<BookingEntity[]> {
    const facility = await new FacilityService().getOneByID(id);
    return this.service.getAllFutureFacilityBookings(facility);
  }
}

export default BookingController;
