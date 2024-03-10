import { NotFoundError } from "routing-controllers";
import { LessThan, MoreThan } from "typeorm";
import { AvailabilityEntity } from "../database/Entities/availabilityEntity";
import { BookingEntity } from "../database/Entities/bookingEntity";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { TransactionType } from "../database/Entities/transactionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import { BookingModel } from "../types/BookingModel";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { TransactionModel } from "../types/TransactionModel";
import AvailabilityService from "./AvailabilityService";
import GenericService from "./GenericService";
import TransactionService from "./TransactionService";

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

  public async chargeForBooking(
    user: UserEntity,
    availability: AvailabilityEntity,
    booking: BookingModel,
  ): Promise<number> {
    //get the number of 30 minute intervals in the booking
    const bookingIntervals =
      (booking.endDateTime.getTime() - booking.startDateTime.getTime()) /
      1800000;
    const totalCost = availability.price * bookingIntervals;
    //get all future bookings for the user, and calculate the total cost of all the bookings
    const futureBookings = await this.getAllFutureUserBookings(user);
    const pendingBalance = futureBookings.reduce((acc, booking) => {
      return acc + booking.cost;
    }, 0);
    //check if the user can afford the booking
    if (totalCost > user.balance - pendingBalance) {
      return 0;
    }
    user.balance -= totalCost;
    const facility = await availability.facility;
    facility.balance += totalCost;
    AppDataSource.getRepository(UserEntity).save(user);
    AppDataSource.getRepository(FacilityEntity).save(facility);
    return totalCost;
  }

  public async refundBooking(
    user: UserEntity,
    availability: AvailabilityEntity,
    booking: BookingEntity,
  ): Promise<number> {
    //check if the user is authorized to do a refund. It can be any provider role, or the user
    // who made the booking
    const transact = await new TransactionService();
    if (
      !user.roles.some((role) => role === "provider") &&
      user.id !== (await booking.user).id
    ) {
      throw new Error("User is not authorized to refund this booking");
    }

    //check if the start time of the booking is in the future
    if (booking.startDateTime.getTime() < Date.now()) {
      throw new Error("Booking start time has already passed");
    }
    const bookingIntervals =
      (booking.endDateTime.getTime() - booking.startDateTime.getTime()) /
      1800000;
    const totalCost = availability.price * bookingIntervals;
    user.balance += totalCost;
    const facility = await availability.facility;
    facility.balance -= totalCost;
    AppDataSource.getRepository(UserEntity).save(user);
    AppDataSource.getRepository(FacilityEntity).save(facility);
    const id = booking.id;
    //post refund transaction
    const transaction: TransactionModel = {
      amountChanged: totalCost,
      eventDescription:
        "service cancellation for " +
        (await (await booking.availability).facility).name,
      date: new Date(),
      user_id: user.id,
      booking_id: id,
      facility_id: (await (await booking.availability).facility).id,
      transactionType: TransactionType.Refund,
      duration:
        -(booking.endDateTime.getTime() - booking.startDateTime.getTime()) /
        60000, //duration in minutes
    };
    transact.createTransaction(transaction);
    return totalCost;
  }

  public async vailidateBooking(
    booking: BookingModel,
    user: UserEntity,
  ): Promise<AvailabilityEntity> {
    if (booking.startDateTime >= booking.endDateTime) {
      throw new Error("Start time must be before end time");
    }
    //end time must be at least 30 minutes after the start time, and the booking length
    //should be a multiple of 30
    if (
      booking.startDateTime.getMinutes() !== 0 &&
      booking.startDateTime.getMinutes() !== 30
    ) {
      throw new Error("Booking start time must be on the hour or half hour");
    }
    if (
      booking.endDateTime.getMinutes() !== 0 &&
      booking.endDateTime.getMinutes() !== 30
    ) {
      throw new Error("Booking end time must be on the hour or half hour");
    }
    if (
      booking.endDateTime.getTime() - booking.startDateTime.getTime() <
      1800000
    ) {
      throw new Error("Booking must be at least 30 minutes long");
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

    //check if the user making the booking can afford the availability
    const maxBookings = await this.getAllFutureUserBookings(user);
    if (maxBookings.length > 30) {
      throw new Error("User has reached the maximum number of bookings");
    }
    return availability;
  }

  public getAllFutureUserBookings(user: UserEntity): Promise<BookingEntity[]> {
    const currentDate = new Date();
    return this.getAll(
      { limit: 30, offset: 0 },
      {
        where: { user: { id: user.id }, startDateTime: MoreThan(currentDate) },
      },
    );
  }

  public async getAllFutureFacilityBookings(
    facility: FacilityEntity,
  ): Promise<BookingEntity[]> {
    const currentDate = new Date();
    return this.getAll(
      { limit: 30, offset: 0 },
      {
        where: {
          availability: { facility: { id: facility.id } },
          startDateTime: MoreThan(currentDate),
        },
      },
    );
  }

  public async getAllPastUserBookings(
    user: UserEntity,
  ): Promise<BookingEntity[]> {
    const currentDate = new Date();
    return this.getAll(
      { limit: 30, offset: 0 },
      {
        where: { user: { id: user.id }, endDateTime: LessThan(currentDate) },
      },
    );
  }

  public async getAllPastFacilityBookings(
    facility: FacilityEntity,
  ): Promise<BookingEntity[]> {
    const currentDate = new Date();
    return this.getAll(
      { limit: 30, offset: 0 },
      {
        where: {
          availability: { facility: { id: facility.id } },
          endDateTime: LessThan(currentDate),
        },
      },
    );
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
    const transact = await new TransactionService();
    const availability = await this.vailidateBooking(booking, user);
    const existingBookings = await availability.bookings;
    //Go through the list of bookings in the availability and check if the new booking starttime or end time conflicts with any of the existing bookings
    for (const currentBooking of existingBookings) {
      if (await this.conflictingBookingsCheck(currentBooking, booking)) {
        throw new Error("New Booking Conflicts with existing booking");
      }
      //charge for the booking
    }
    const cost = await this.chargeForBooking(user, availability, booking);
    const newBooking = new BookingEntity();
    newBooking.startDateTime = booking.startDateTime;
    newBooking.endDateTime = booking.endDateTime;
    //(await newBooking.user).id = user.id;
    newBooking.user = Promise.resolve(user);
    newBooking.cost = cost;
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    newBooking.availability = Promise.resolve(availability);
    const resp = await this.repository.save(newBooking);
    const transaction: TransactionModel = {
      amountChanged: -1 * cost,
      eventDescription:
        "service rental for " + (await availability.facility).name,
      date: new Date(),
      user_id: user.id,
      booking_id: resp.id,
      facility_id: (await availability.facility).id,
      transactionType: TransactionType.Transfer,
      duration:
        (booking.endDateTime.getTime() - booking.startDateTime.getTime()) /
        60000, //duration in minutes
    };
    transact.createTransaction(transaction);
    return newBooking;
  }

  //Should work in the case of updating within the same availablity, or a new availability
  public async updateBooking(
    user: UserEntity,
    booking_id: number,
    booking: BookingModel,
  ): Promise<BookingEntity> {
    const transact = await new TransactionService();
    const availability = await this.vailidateBooking(booking, user);
    const currentBooking = await this.getOneByID(booking_id);
    // console.log(user.id, (await currentBooking.user).id);
    if (user.id != (await currentBooking.user).id) {
      throw new Error("This user cannot update this booking");
    }
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
    currentBooking.cost = await this.chargeForBooking(
      user,
      availability,
      booking,
    );
    const resp = await this.repository.save(currentBooking);
    const transaction: TransactionModel = {
      amountChanged: -1 * currentBooking.cost,
      eventDescription:
        "service rental for " + (await availability.facility).name,
      date: new Date(),
      user_id: user.id,
      booking_id: resp.id,
      facility_id: (await availability.facility).id,
      transactionType: TransactionType.Transfer,
      duration:
        (currentBooking.endDateTime.getTime() -
          currentBooking.startDateTime.getTime()) /
        60000, //duration in minutes
    };
    transact.createTransaction(transaction);
    return currentBooking;
  }

  public async getBookings(user: UserEntity, filter: GetAllQuery) {
    return await this.getAll(filter, {
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
    //refund the booking
    await this.refundBooking(user, await booking.availability, booking);
    return this.delete(booking_id);
  }
}

export default BookingService;
