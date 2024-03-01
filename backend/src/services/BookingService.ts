import { NotFoundError } from "routing-controllers";
import { AvailabilityEntity } from "../database/Entities/availabilityEntity";
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

  public async vailidateBooking(
    booking: BookingModel,
  ): Promise<AvailabilityEntity> {
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
    return availability;
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
    const availability = await this.vailidateBooking(booking);
    const existingBookings = await availability.bookings;
    //Go through the list of bookings in the availability and check if the new booking starttime or end time conflicts with any of the existing bookings
    for (const currentBooking of existingBookings) {
      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
    }

    const newBooking = new BookingEntity();
    newBooking.startDateTime = booking.startDateTime;
    newBooking.endDateTime = booking.endDateTime;
    newBooking.user = Promise.resolve(user);
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    newBooking.availability = Promise.resolve(availability);
    return this.repository.save(newBooking);
  }

  //Should work in the case of updating within the same availablity, or a new availability
  public async updateBooking(
    user: UserEntity,
    booking_id: number,
    booking: BookingModel,
  ): Promise<BookingEntity> {
    const availability = await this.vailidateBooking(booking);
    const currentBooking = await this.getOneByID(booking_id);
    if (!currentBooking) {
      throw new NotFoundError("Booking not found");
    }
    const existingBookings = await availability.bookings;

    //Check conflicts, but ignore if we are currently comparing the update to the old booking
    for (const currentBooking of existingBookings) {
      if (currentBooking.id === booking_id) continue;

      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
    }
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    currentBooking.startDateTime = booking.startDateTime;
    currentBooking.endDateTime = booking.endDateTime;
    currentBooking.availability = Promise.resolve(availability);
    return this.repository.save(currentBooking);
  }

  public async getBookings(user: UserEntity, filter: GetAllQuery) {
    return this.getAll(filter, {
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  public async deleteBooking(user: UserEntity, booking_id: number) {
    const booking = await this.getOneByID(booking_id, {
      user: {
        id: user.id,
      },
    });
    if (!booking) {
      throw new NotFoundError("Booking not found on current user");
    }
    return this.delete(booking_id);
  }
}

export default BookingService;
