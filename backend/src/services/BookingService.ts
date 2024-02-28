import { NotFoundError } from "routing-controllers";
import { Repository } from "typeorm";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import { BookingModel } from "../types/BookingModel";
import AvailabilityService from "./AvailabilityService";

class BookingService {
  repository: Repository<BookingEntity>;
  //availabilityRepository: Repository<AvailabilityEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookingEntity);
    //this.availabilityRepository = AppDataSource.getRepository(AvailabilityEntity);
  }

  public async conflictingBookingsCheck(
    establishedBooking: BookingEntity,
    proposedBooking: BookingModel,
  ): Promise<boolean> {
    //check if the new booking start time or end time is within the range of the old booking
    if (
      (proposedBooking.startDateTime >= establishedBooking.startDateTime &&
        proposedBooking.startDateTime <= establishedBooking.endDateTime) ||
      (proposedBooking.endDateTime >= establishedBooking.startDateTime &&
        proposedBooking.endDateTime <= establishedBooking.endDateTime)
    )
      return true;
    return false;
  }

  public async vailidateBooking(booking: BookingModel): Promise<void> {
    if (booking.startDateTime >= booking.endDateTime) {
      throw new Error("Start time must be before end time");
    }
    const availability = await new AvailabilityService().getAvailabilityByID(
      booking.availability_id,
    );
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    if (
      booking.startDateTime < availability.startTime ||
      booking.endDateTime > availability.endTime
    ) {
      throw new Error("Booking must be within the availability");
    }
    return;
  }

  public async getBookingsForAvailability(
    id: number,
  ): Promise<BookingEntity[]> {
    const availability = await new AvailabilityService().getAvailabilityByID(
      id,
    );
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    return availability.bookings;
  }

  public async createBooking(
    user: UserEntity,
    booking: BookingModel,
  ): Promise<BookingEntity> {
    await this.vailidateBooking(booking);
    const availabilityId = booking.availability_id;
    const existingBookings =
      await this.getBookingsForAvailability(availabilityId);
    //Go through the list of bookings in the availability and check if the new booking starttime or end time conflicts with any of the existing bookings
    for (const currentBooking of existingBookings) {
      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
    }

    const newBooking = new BookingEntity();
    newBooking.startDateTime = booking.startDateTime;
    newBooking.endDateTime = booking.endDateTime;
    newBooking.user = user;
    const availability = await new AvailabilityService().getAvailabilityByID(
      availabilityId,
    );
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    newBooking.availability = availability;
    return this.repository.save(newBooking);
  }

  //Should work in the case of updating within the same availablity, or a new availability
  public async updateBooking(
    user: UserEntity,
    booking_id: number,
    booking: BookingModel,
  ): Promise<BookingEntity> {
    await this.vailidateBooking(booking);
    const oldBooking = await this.repository.findOne({
      where: { bookingId: booking_id },
    });
    if (!oldBooking) {
      throw new NotFoundError("Booking not found");
    }
    const availabilityId = booking.availability_id;
    const existingBookings =
      await this.getBookingsForAvailability(availabilityId);

    //Check conflicts, but ignore if we are currently comparing the update to the old booking
    for (const currentBooking of existingBookings) {
      if (currentBooking.bookingId === booking_id) continue;

      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
    }
    oldBooking.startDateTime = booking.startDateTime;
    oldBooking.endDateTime = booking.endDateTime;
    const availability = await new AvailabilityService().getAvailabilityByID(
      availabilityId,
    );
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    oldBooking.availability = availability;
    return this.repository.save(oldBooking);
  }

  public async getBookings(user: UserEntity) {
    return user.bookings;
  }

  public async deleteBooking(user: UserEntity, booking_id: number) {
    const bookings = user.bookings;
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
