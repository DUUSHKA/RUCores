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
  async getOne(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    const booking = await this.service.getOneByID(id);
    const availability = await booking.availability;
    const facility = await availability.facility;
    if (
      (await booking.user).id == user.id ||
      (await user.managedFacilities).some((obj) => obj.id === facility.id) ||
      user.roles.includes("admin")
    ) {
      return booking;
    }
    throw new ForbiddenError(
      "User is not the owner or a provider for the booking or an admin",
    );
  }

  @Get("/deleted/bookingID/:id")
  @Authorized(["admin"])
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
  async put(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
    @Body({
      validate: { forbidUnknownValues: true, skipMissingProperties: true },
    })
    booking: BookingModel,
  ): Promise<BookingEntity> {
    const old = this.service.getOneByID(id);
    if (
      (await (await old).user).id == user.id ||
      (await user.managedFacilities).some(
        async (obj) =>
          obj.id === (await (await (await old).availability).facility).id,
      ) ||
      user.roles.includes("admin")
    ) {
      return this.service.updateBooking(user, id, booking);
    }
    throw new ForbiddenError(
      "User is not the owner or provider for the booking or an admin",
    );
  }

  @Delete("/:id")
  @HttpCode(204)
  @OpenAPI({
    summary: "Delete a booking",
  })
  @OnUndefined(204)
  async remove(@CurrentUser() user: UserEntity, @Param("id") id: number) {
    const old = this.service.getOneByID(id);
    if (
      (await (await old).user).id == user.id ||
      (await user.managedFacilities).some(
        async (obj) =>
          obj.id === (await (await (await old).availability).facility).id,
      ) ||
      user.roles.includes("admin")
    ) {
      return this.service.deleteBooking(user, id);
    }
    throw new ForbiddenError(
      "User is not the owner or provider for the booking or an admin",
    );
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
  async getAllFutureFacilityBookings(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
  ): Promise<BookingEntity[]> {
    const facility = await new FacilityService().getOneByID(id);
    if (
      (await user.managedFacilities).some((obj) => obj.id === facility.id) ||
      user.roles.includes("admin")
    ) {
      return this.service.getAllFutureFacilityBookings(facility);
    }
    throw new ForbiddenError(
      "User is not the provider for the facility or an admin",
    );
  }

  @Get("/pastFacility/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all past bookings for a facility",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  async getAllPastFacilityBookings(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
  ): Promise<BookingEntity[]> {
    const facility = await new FacilityService().getOneByID(id);
    if (
      (await user.managedFacilities).some((obj) => obj.id === facility.id) ||
      user.roles.includes("admin")
    ) {
      return this.service.getAllPastFacilityBookings(facility);
    }
    throw new ForbiddenError(
      "User is not the provider for the facility or an admin",
    );
  }

  @Get("/futureUser/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all future bookings for a User",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  async getAllFutureBookingUsers(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
  ): Promise<BookingEntity[]> {
    if (id == user.id || user.roles.includes("admin")) {
      return this.service.getAllFutureUserBookings(user);
    }
    throw new ForbiddenError(
      "User is trying to get another user's bookings or is not an admin",
    );
  }

  @Get("/pastUser/:id")
  @HttpCode(200)
  @OpenAPI({
    summary: "Get all past bookings for a User",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  async getAllPastBookingUsers(
    @CurrentUser() user: UserEntity,
    @Param("id") id: number,
  ): Promise<BookingEntity[]> {
    if (id == user.id || user.roles.includes("admin")) {
      return this.service.getAllFutureUserBookings(user);
    }
    throw new ForbiddenError(
      "User is trying to get another user's bookings or is not an admin",
    );
  }
}

export default BookingController;
