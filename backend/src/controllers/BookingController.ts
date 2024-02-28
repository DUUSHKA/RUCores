import { CurrentUser, Get, JsonController } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { auth_errors } from "../documentation/common";
import BookingService from "../services/BookingService";

@JsonController("/bookings")
@OpenAPI(auth_errors)
export class BookingController {
  service: BookingService;

  constructor() {
    this.service = new BookingService();
  }

  @Get("/current")
  @OpenAPI({
    description: "Get all bookings for the current user",
  })
  @ResponseSchema(BookingEntity, { isArray: true })
  public async getAllForUser(
    @CurrentUser() user: UserEntity,
  ): Promise<BookingEntity[]> {
    return user.bookings;
  }
}
