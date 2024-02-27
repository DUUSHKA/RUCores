import { CurrentUser, Get, JsonController } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserEntity } from "../database/Entities/userEntity";
import BookingService from "../services/BookingService";

@JsonController("/bookings")
export class BookingController {
  service: BookingService;

  constructor() {
    this.service = new BookingService();
  }

  @Get("/current")
  @OpenAPI({
    description: "Get all bookings for the current user",
  })
  public async getAllForUser(@CurrentUser() user: UserEntity) {
    return user.bookings;
  }
}
