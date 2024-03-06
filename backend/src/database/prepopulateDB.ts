import crypto from "crypto";
import AppDataSource from "./data-source";
import { AvailabilityEntity } from "./Entities/availabilityEntity";
import { BookingEntity } from "./Entities/bookingEntity";
import { FacilityEntity } from "./Entities/facilityEntity";
import { SessionEntity } from "./Entities/sessionEntity";
import { UserEntity } from "./Entities/userEntity";

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
  const facility = new FacilityEntity();
  //const facility2 = new FacilityEntity();
  const booking = new BookingEntity();
  const chemBooking1 = new BookingEntity();
  const chemBooking2 = new BookingEntity();
  const chemBooking3 = new BookingEntity();
  const chemBooking4 = new BookingEntity();
  //const physBooking = new BookingEntity();
  const session = new SessionEntity();
  const date1Original = new Date(2024, 2, 4, 12, 0, 0);
  const date2Original = new Date(2024, 1, 26, 12, 0, 0);
  const date3Original = new Date(2024, 3, 15, 12, 0, 0);
  const date1 = new Date(date1Original.getTime() + -5 * 60 * 60 * 1000);
  const date2 = new Date(date2Original.getTime() + -5 * 60 * 60 * 1000);
  const date3 = new Date(date3Original.getTime() + -5 * 60 * 60 * 1000);
  // booking.bookingId = i;
  // facility.id = i;
  // availability.availabilityId = i;

  /////////////// USERS ///////////////////////

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
  user1.bookings = Promise.resolve([chemBooking1]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  //user1.managedFacilities = Promise.resolve([facility]);
  user1.sessions = Promise.resolve([session]);
  user1.isProvider = false;
  user1.balance = 100;

  const user2 = new UserEntity();
  user2.firstName = "George";
  user2.lastName = "Markson";
  user2.username = "GeorgeMarkson456";
  user2.email = "GM@gmail.com";
  const salt2 = crypto.randomBytes(16).toString("hex");
  user2.salt = salt2;
  const hmac2 = crypto.createHmac("sha256", salt2);
  user2.hashedPassword = hmac2.update("password").digest("hex");
  user2.roles = ["user"];
  user2.bookings = Promise.resolve([chemBooking2]);
  //user2.bookings = Promise.resolve([physBooking]);

  //console.log("user: ", user);
  //console.log("facility: ", facility);
  //user1.managedFacilities = Promise.resolve([facility]);
  user2.sessions = Promise.resolve([session]);
  user2.isProvider = false;
  user2.balance = 300;

  const user3 = new UserEntity();
  user3.firstName = "Kevin";
  user3.lastName = "Jameson";
  user3.username = "KevinJameson654";
  user3.email = "KJ@gmail.com";
  const salt3 = crypto.randomBytes(16).toString("hex");
  user3.salt = salt3;
  const hmac3 = crypto.createHmac("sha256", salt3);
  user3.hashedPassword = hmac3.update("password").digest("hex");
  user3.roles = ["user"];
  user3.bookings = Promise.resolve([chemBooking3]);
  //user3.managedFacilities = Promise.resolve([facility2]);

  //console.log("user: ", user);
  //console.log("facility: ", facility);
  //user1.managedFacilities = Promise.resolve([facility]);
  user3.sessions = Promise.resolve([session]);
  user3.isProvider = false;
  user3.balance = 300;

  const user4 = new UserEntity();
  user4.firstName = "Carl";
  user4.lastName = "Jonathan";
  user4.username = "CarlJonathan789";
  user4.email = "CJ@gmail.com";
  const salt4 = crypto.randomBytes(16).toString("hex");
  user4.salt = salt4;
  const hmac4 = crypto.createHmac("sha256", salt4);
  user4.hashedPassword = hmac4.update("password").digest("hex");
  user4.roles = ["user"];
  user4.bookings = Promise.resolve([chemBooking4]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  //user1.managedFacilities = Promise.resolve([facility]);
  user4.sessions = Promise.resolve([session]);
  user4.isProvider = false;
  user4.balance = 300;

  ///////////////// CHEMISTRY LAB /////////////////////
  const chemAvailability = new AvailabilityEntity();
  chemAvailability.Date = date1;
  chemAvailability.startTime = dateAdd(chemAvailability.Date, "hour", 3);
  chemAvailability.endTime = dateAdd(chemAvailability.startTime, "hour", 3);
  chemAvailability.facility = Promise.resolve(facility);
  chemAvailability.bookings = Promise.resolve([booking]);
  chemAvailability.price = 20;

  const chemAvailability1 = new AvailabilityEntity();
  chemAvailability1.Date = dateAdd(date1, "day", 1);
  chemAvailability1.startTime = dateAdd(chemAvailability1.Date, "hour", 2);
  chemAvailability1.endTime = dateAdd(chemAvailability1.startTime, "hour", 3);
  chemAvailability1.facility = Promise.resolve(facility);
  chemAvailability1.bookings = Promise.resolve([chemBooking1]);
  chemAvailability1.price = 20;

  const chemAvailability2 = new AvailabilityEntity();
  chemAvailability2.Date = dateAdd(date2, "day", 2);
  chemAvailability2.startTime = dateAdd(chemAvailability2.Date, "hour", 4);
  chemAvailability2.endTime = dateAdd(chemAvailability2.startTime, "hour", 3);
  chemAvailability2.facility = Promise.resolve(facility);
  chemAvailability2.bookings = Promise.resolve([chemBooking2]);
  chemAvailability2.price = 20;

  const chemAvailability3 = new AvailabilityEntity();
  chemAvailability3.Date = dateAdd(date1, "week", 1);
  chemAvailability3.startTime = dateAdd(chemAvailability3.Date, "hour", 5);
  chemAvailability3.endTime = dateAdd(chemAvailability3.startTime, "hour", 3);
  chemAvailability3.facility = Promise.resolve(facility);
  chemAvailability3.bookings = Promise.resolve([chemBooking3]);
  chemAvailability3.price = 20;

  const chemAvailability4 = new AvailabilityEntity();
  chemAvailability4.Date = dateAdd(date3, "week", -1);
  chemAvailability4.startTime = dateAdd(chemAvailability4.Date, "hour", 6);
  chemAvailability4.endTime = dateAdd(chemAvailability4.startTime, "hour", 3);
  chemAvailability4.facility = Promise.resolve(facility);
  chemAvailability4.bookings = Promise.resolve([chemBooking4]);
  chemAvailability4.price = 20;

  facility.name = "Chemistry Lab";
  facility.availabilities = Promise.resolve([
    chemAvailability,
    chemAvailability1,
    chemAvailability2,
    chemAvailability3,
    chemAvailability4,
  ]);
  //facility.providers = [user];
  facility.description = "A lab for chemistry experiments";
  facility.address = "123 Rutgers Way";
  facility.balance = 0;
  facility.equipment = "Microscopes, Bunsen burners, test tubes, beakers, etc.";

  booking.startDateTime = chemAvailability.startTime;
  booking.endDateTime = chemAvailability.endTime;
  booking.user = Promise.resolve(user);
  booking.availability = Promise.resolve(chemAvailability);
  booking.cost = 20;

  chemBooking1.startDateTime = chemAvailability1.startTime;
  chemBooking1.endDateTime = chemAvailability1.endTime;
  chemBooking1.user = Promise.resolve(user1);
  chemBooking1.availability = Promise.resolve(chemAvailability1);
  chemBooking1.cost = 20;

  chemBooking2.startDateTime = chemAvailability2.startTime;
  chemBooking2.endDateTime = chemAvailability2.endTime;
  chemBooking2.user = Promise.resolve(user2);
  chemBooking2.availability = Promise.resolve(chemAvailability2);
  chemBooking2.cost = 20;

  chemBooking3.startDateTime = chemAvailability3.startTime;
  chemBooking3.endDateTime = chemAvailability3.endTime;
  chemBooking3.user = Promise.resolve(user3);
  chemBooking3.availability = Promise.resolve(chemAvailability3);
  chemBooking3.cost = 20;

  chemBooking4.startDateTime = chemAvailability4.startTime;
  chemBooking4.endDateTime = chemAvailability4.endTime;
  chemBooking4.user = Promise.resolve(user3);
  chemBooking4.availability = Promise.resolve(chemAvailability4);
  chemBooking4.cost = 20;

  ////////////// PHYSICS LAB ///////////////////
  /*
const physAvailability = new AvailabilityEntity();
physAvailability.Date = date1;
physAvailability.startTime = dateAdd(physAvailability.Date, "day", 3);
physAvailability.endTime = dateAdd(physAvailability.startTime, "hour", 3);
physAvailability.facility = Promise.resolve(facility2);
physAvailability.bookings = Promise.resolve([physBooking]);
physAvailability.price = 25;




facility2.name = "Physics Lab";
facility2.availabilities = Promise.resolve([
  physAvailability,
]);
//facility.providers = [user];
facility2.description = "A lab for physics experiments";
facility2.address = "456 Rutgers Way";
facility2.balance = 50;
facility2.equipment = "Resistor, Multimeter, Battery, Spring Scale, etc.";


*/

  await AppDataSource.manager.save(user);
  await AppDataSource.manager.save(user1);
  await AppDataSource.manager.save(user2);
  await AppDataSource.manager.save(user3);
  await AppDataSource.manager.save(user4);
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
