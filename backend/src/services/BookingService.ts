import { NotFoundError } from "routing-controllers";
import { Repository } from "typeorm";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";

class BookingService {
  repository: Repository<BookingEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookingEntity);
  }

  public async getBookings(user: UserEntity) {
    return user.bookings;
  }

  public async deleteBooking(user: UserEntity, booking_id: number) {
    const bookings = await user.bookings;
    const booking = bookings.find(
      (booking: BookingEntity) => booking.bookingId === booking_id,
    );
    if (!booking) {
      throw new NotFoundError("Booking not found on current user");
    }
    return this.repository.remove(booking);
  }
}

export default BookingService;
