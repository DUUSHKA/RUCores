import { NotFoundError } from "routing-controllers";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { BookingModel } from "../types/BookingModel";
import { GetAllQuery } from "../types/GenericUtilTypes";
import AvailabilityService from "./AvailabilityService";
import GenericService from "./GenericService";

class BookingService extends GenericService<BookingEntity> {
  constructor() {
    super(BookingEntity);
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
    const availability = await new AvailabilityService().getOneByID(
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
  }

  public async getBookingsForAvailability(
    id: number,
  ): Promise<BookingEntity[]> {
    const availability = await new AvailabilityService().getOneByID(id);
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
    const availability = await new AvailabilityService().getOneByID(
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
      where: { id: booking_id },
    });
    if (!oldBooking) {
      throw new NotFoundError("Booking not found");
    }
    const availabilityId = booking.availability_id;
    const existingBookings =
      await this.getBookingsForAvailability(availabilityId);

    //Check conflicts, but ignore if we are currently comparing the update to the old booking
    for (const currentBooking of existingBookings) {
      if (currentBooking.id === booking_id) continue;

      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
    }
    const availability = await new AvailabilityService().getOneByID(
      availabilityId,
    );
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    oldBooking.startDateTime = booking.startDateTime;
    oldBooking.endDateTime = booking.endDateTime;
    oldBooking.availability = availability;
    return this.repository.save(oldBooking);
  }

  public async getBookings(user: UserEntity, filter: GetAllQuery) {
    return this.getAll(filter, {
      where: { user: user },
    });
  }

  public async deleteBooking(user: UserEntity, booking_id: number) {
    const booking = await this.getOneByID(booking_id, {
      user: user,
    });
    if (!booking) {
      throw new NotFoundError("Booking not found on current user");
    }
    return this.delete(booking_id);
  }
}

export default BookingService;
