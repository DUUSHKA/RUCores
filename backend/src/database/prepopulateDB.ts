import crypto from "crypto";
import { AvailabilityEntity } from "./Entities/availabilityEntity";
import { BookingEntity } from "./Entities/bookingEntity";
import { FacilityEntity } from "./Entities/facilityEntity";
import { SessionEntity } from "./Entities/sessionEntity";
import { UserEntity } from "./Entities/userEntity";
import AppDataSource from "./data-source";

const firstname = "johny";
const lastname = "bravo";

export const prepopulateDB = async () => {
  // const sqlFilePath = path.join(__dirname, './reset_db.sql');
  // const sql_reset = fs.readFileSync(sqlFilePath, 'utf8');
  // const reset_result = await AppDataSource.query(sql_reset);
  // console.log("Resetting DB");
  // console.log(reset_result);

  for (let i = 0; i < 5; i++) {
    const user = new UserEntity();
    const booking = new BookingEntity();
    const facility = new FacilityEntity();
    const availability = new AvailabilityEntity();
    const session = new SessionEntity();
    user.id = i;
    booking.bookingId = i;
    facility.id = i;
    availability.availabilityId = i;

    user.firstName = firstname.substring(0, i);
    user.lastName = lastname.substring(0, i);
    user.username = "username " + i;
    user.email = "email " + i;
    const salt = crypto.randomBytes(16).toString("hex");
    user.salt = salt;
    const hmac = crypto.createHmac("sha256", salt);
    user.hashedPassword = hmac.update("password").digest("hex");

    user.roles = ["provider", "admin"];
    user.bookings = Promise.resolve([booking]); // Store in lazy loading
    //console.log("user: ", user);
    //console.log("facility: ", facility);
    user.managedFacilities = [facility];

    user.sessions = Promise.resolve([session]);
    user.isProvider = true;

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
    //facility.providers = [user];
    facility.description = "description " + i;
    facility.address = "address " + i;

    await AppDataSource.manager.save(user);
    //await AppDataSource.manager.save(session).catch((err) => console.log(err));
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
