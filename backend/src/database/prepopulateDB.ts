import { User } from "./Entities/userEntity";
import AppDataSource from "./data-source";
import { Booking } from "./Entities/bookingEntity";
import { Facility } from "./Entities/facilityEntity";
import { Availability } from "./Entities/availabilityEntity";

const firstname = "johny";
const lastname = "bravo";

export const prepopulateDB = async () => {
  for (let i = 0; i < 5; i++) {
    const user = new User();
    const booking = new Booking();
    const facility = new Facility();
    const availability = new Availability();
    user.id = i;
    booking.bookingId = i;
    facility.id = i;
    availability.availabilityId = i;

    user.firstName = firstname.substring(0, i);
    user.lastName = lastname.substring(0, i);
    user.isProvider = true;
    user.bookings = [booking];
    user.managedFacilities = [facility];

    booking.startDateTime = new Date();
    booking.endDateTime = new Date();
    booking.user = user;
    booking.availability = availability;

    availability.Date = new Date();
    availability.startTime = new Date();
    availability.endTime = new Date();
    availability.facility = facility;
    availability.bookings = [booking];

    facility.name = "facility " + i;
    facility.availabilities = [availability];
    facility.provider = user;
    facility.description = "description " + i;
    facility.address = "address " + i;

    await AppDataSource.manager.save(user).catch((err) => console.log(err));
    // await AppDataSource.manager.save(booking).catch((err) => console.log(err));
    // await AppDataSource.manager.save(facility).catch((err) => console.log(err));
    // await AppDataSource.manager.save(availability).catch((err) => console.log(err));
  }

  console.log("DB prepopulated!!");
  // const provider = await AppDataSource.getRepository(User).findOneBy({isProvider: true});
  // const user = await AppDataSource.getRepository(User).findOneBy({isProvider: false});

  // const bookingRepo = AppDataSource.getRepository(Booking);
  // const user = await AppDataSource.getRepository(User).findOneBy({id: 1});

  // if( user !== null)
  // bookingRepo.create({ bookingId: 1, startDateTime: new Date(),
  //     endDateTime: new Date(), user: user, });
};
