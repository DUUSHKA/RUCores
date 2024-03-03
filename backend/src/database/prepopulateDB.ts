import crypto from "crypto";
import { AvailabilityEntity } from "./Entities/availabilityEntity";
import { BookingEntity } from "./Entities/bookingEntity";
import { FacilityEntity } from "./Entities/facilityEntity";
import { SessionEntity } from "./Entities/sessionEntity";
import { UserEntity } from "./Entities/userEntity";
import AppDataSource from "./data-source";

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date: Date, interval: string, units: number): Date {
  if (!(date instanceof Date)) throw new Error("Invalid date");
  const ret: Date = new Date(date); //don't change original date
  const checkRollover = function () {
    if (ret.getDate() != date.getDate()) ret.setDate(0);
  };
  switch (String(interval).toLowerCase()) {
    case "year":
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case "quarter":
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case "month":
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case "week":
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case "day":
      ret.setDate(ret.getDate() + units);
      break;
    case "hour":
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case "minute":
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case "second":
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      throw new Error("Invalid interval: " + interval);
  }
  return ret;
}
export const prepopulateDB = async () => {
  // const sqlFilePath = path.join(__dirname, './reset_db.sql');
  // const sql_reset = fs.readFileSync(sqlFilePath, 'utf8');
  // const reset_result = await AppDataSource.query(sql_reset);
  // console.log("Resetting DB");
  // console.log(reset_result);

  const user = new UserEntity();
  const booking = new BookingEntity();
  const facility = new FacilityEntity();
  const availability = new AvailabilityEntity();
  const session = new SessionEntity();

  // user.id = i;
  // booking.bookingId = i;
  // facility.id = i;
  // availability.availabilityId = i;

  user.firstName = "John";
  user.lastName = "Doe";
  user.username = "JohnDoe123";
  user.email = "JohnDoe@gmail.com";
  const salt = crypto.randomBytes(16).toString("hex");
  user.salt = salt;
  const hmac = crypto.createHmac("sha256", salt);
  user.hashedPassword = hmac.update("password").digest("hex");

  user.roles = ["provider", "admin"];
  user.bookings = Promise.resolve([booking]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  user.managedFacilities = Promise.resolve([facility]);

  user.sessions = Promise.resolve([session]);
  user.isProvider = true;
  user.balance = 300;

  const user1 = new UserEntity();
  user1.firstName = "Harry";
  user1.lastName = "Baker";
  user1.username = "BakerHarry321";
  user1.email = "HB@gmail.com";
  const salt1 = crypto.randomBytes(16).toString("hex");
  user1.salt = salt1;
  const hmac1 = crypto.createHmac("sha256", salt1);
  user1.hashedPassword = hmac1.update("password").digest("hex");

  user1.roles = ["user"];
  //user1.bookings = Promise.resolve([booking]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  //user1.managedFacilities = Promise.resolve([facility]);

  user1.sessions = Promise.resolve([session]);
  user1.isProvider = false;
  user1.balance = 300;

  booking.startDateTime = dateAdd(new Date(), "hour", 5);
  booking.endDateTime = dateAdd(new Date(), "hour", 6);
  booking.user = Promise.resolve(user);
  booking.availability = Promise.resolve(availability);
  booking.cost = 100;

  availability.Date = new Date();
  availability.startTime = dateAdd(new Date(), "hour", 3);
  availability.endTime = dateAdd(new Date(), "hour", 7);
  availability.facility = Promise.resolve(facility);
  availability.bookings = Promise.resolve([booking]);
  availability.price = 20;

  const availability1 = new AvailabilityEntity();
  availability1.Date = dateAdd(new Date(), "day", 1);
  availability1.startTime = dateAdd(availability1.Date, "hour", 3);
  availability1.endTime = dateAdd(availability1.startTime, "hour", 3);
  availability1.facility = Promise.resolve(facility);
  availability1.price = 50;

  const availability2 = new AvailabilityEntity();
  availability2.Date = dateAdd(new Date(), "day", -1);
  availability2.startTime = dateAdd(availability2.Date, "hour", 3);
  availability2.endTime = dateAdd(availability2.startTime, "hour", 3);
  availability2.facility = Promise.resolve(facility);
  availability2.price = 10;

  facility.name = "Chemistry Lab";
  facility.availabilities = Promise.resolve([
    availability,
    availability1,
    availability2,
  ]);
  //facility.providers = [user];
  facility.description = "A lab for chemistry experiments";
  facility.address = "123 Rutgers Way";
  facility.balance = 0;
  facility.equipment = "Microscopes, Bunsen burners, test tubes, beakers, etc.";

  await AppDataSource.manager.save(user);
  await AppDataSource.manager.save(user1);
  //await AppDataSource.manager.save(session).catch((err) => console.log(err));
  // await AppDataSource.manager.save(booking).catch((err) => console.log(err));
  // await AppDataSource.manager.save(facility).catch((err) => console.log(err));
  // await AppDataSource.manager.save(availability).catch((err) => console.log(err));

  console.log("DB prepopulated!!");
  // const provider = await AppDataSource.getRepository(User).findOneBy({isProvider: true});
  // const user = await AppDataSource.getRepository(User).findOneBy({isProvider: false});

  // const bookingRepo = AppDataSource.getRepository(Booking);
  // const user = await AppDataSource.getRepository(User).findOneBy({id: 1});

  // if( user !== null)
  // bookingRepo.create({ bookingId: 1, startDateTime: new Date(),
  //     endDateTime: new Date(), user: user, });
};
