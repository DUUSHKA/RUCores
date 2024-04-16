import crypto from "crypto";
import AppDataSource from "./data-source";
import { AvailabilityEntity } from "./Entities/availabilityEntity";
import { BookingEntity } from "./Entities/bookingEntity";
import { FacilityEntity } from "./Entities/facilityEntity";
import { SessionEntity } from "./Entities/sessionEntity";
import { TransactionEntity } from "./Entities/transactionEntity";
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
  const facility2 = new FacilityEntity();
  const facility3 = new FacilityEntity();

  const booking = new BookingEntity();
  const chemBooking1 = new BookingEntity();
  const chemBooking2 = new BookingEntity();
  const chemBooking3 = new BookingEntity();
  const chemBooking4 = new BookingEntity();
  const chemBooking5 = new BookingEntity();
  const chemBooking6 = new BookingEntity();
  const chemBooking7 = new BookingEntity();
  const chemBooking8 = new BookingEntity();

  const physBooking = new BookingEntity();
  const physBooking1 = new BookingEntity();
  const physBooking2 = new BookingEntity();
  const physBooking3 = new BookingEntity();
  const physBooking4 = new BookingEntity();
  const physBooking5 = new BookingEntity();
  const physBooking6 = new BookingEntity();
  const physBooking7 = new BookingEntity();
  const physBooking8 = new BookingEntity();
  const physBooking9 = new BookingEntity();

  const bioBooking = new BookingEntity();
  const bioBooking1 = new BookingEntity();
  const bioBooking2 = new BookingEntity();
  const bioBooking3 = new BookingEntity();
  const bioBooking4 = new BookingEntity();
  const bioBooking5 = new BookingEntity();
  const bioBooking6 = new BookingEntity();
  const bioBooking7 = new BookingEntity();
  const bioBooking8 = new BookingEntity();
  const bioBooking9 = new BookingEntity();

  const session = new SessionEntity();
  const date1Original = new Date(2024, 3, 4, 12, 0, 0);
  const date2Original = new Date(2024, 2, 26, 12, 0, 0);
  const date3Original = new Date(2024, 4, 15, 12, 0, 0);
  const date4Original = new Date(2023, 3, 4, 12, 0, 0);
  const date5Original = new Date(2023, 9, 4, 12, 0, 0);
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
  user.bookings = Promise.resolve([booking, physBooking3]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  user.managedFacilities = Promise.resolve([facility, facility2, facility3]);
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
  user1.bookings = Promise.resolve([chemBooking1, physBooking2, bioBooking]);
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
  user2.bookings = Promise.resolve([chemBooking2, physBooking1, bioBooking1]);
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
  user3.roles = ["user", "provider"];
  user3.isProvider = true;
  user3.bookings = Promise.resolve([chemBooking3, physBooking1, bioBooking2]);
  user3.managedFacilities = Promise.resolve([facility2]);

  // transaction.amountChanged = Math.floor(Math.random() * 1001) - 500;
  // transaction.date = new Date();
  // transaction.eventDesription = "Transaction " + i;
  // if (i % 3 == 0) transaction.transactionType = TransactionType.Refund;
  // else if (i % 3 == 1) transaction.transactionType = TransactionType.Refill;
  // else transaction.transactionType = TransactionType.Transfer;
  // transaction.user = user;
  // transaction.facility = facility;

  // await AppDataSource.manager.save(user);
  //await AppDataSource.manager.save(session).catch((err) => console.log(err));
  // await AppDataSource.manager.save(booking).catch((err) => console.log(err));
  // await AppDataSource.manager.save(facility).catch((err) => console.log(err));
  // await AppDataSource.manager.save(availability).catch((err) => console.log(err));
  //}
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
  user4.roles = ["provider"];
  user4.bookings = Promise.resolve([chemBooking4, physBooking, bioBooking3]);
  //console.log("user: ", user);
  //console.log("facility: ", facility);
  user4.managedFacilities = Promise.resolve([facility3]);
  user4.sessions = Promise.resolve([session]);
  user4.isProvider = false;
  user4.balance = 300;

  ///////////////// CHEMISTRY LAB /////////////////////
  const chemAvailability = new AvailabilityEntity();
  chemAvailability.Date = date1Original;
  chemAvailability.startTime = dateAdd(chemAvailability.Date, "hour", 3);
  chemAvailability.endTime = dateAdd(chemAvailability.startTime, "hour", 3);
  chemAvailability.facility = Promise.resolve(facility);
  //chemAvailability.bookings = Promise.resolve([booking]);
  chemAvailability.price = 20;

  const chemAvailability1 = new AvailabilityEntity();
  chemAvailability1.Date = dateAdd(date1Original, "day", 1);
  chemAvailability1.startTime = dateAdd(chemAvailability1.Date, "hour", 2);
  chemAvailability1.endTime = dateAdd(chemAvailability1.startTime, "hour", 3);
  chemAvailability1.facility = Promise.resolve(facility);
  chemAvailability1.bookings = Promise.resolve([chemBooking1]);
  chemAvailability1.price = 20;

  const chemAvailability2 = new AvailabilityEntity();
  chemAvailability2.Date = dateAdd(date2Original, "day", 2);
  chemAvailability2.startTime = dateAdd(chemAvailability2.Date, "hour", 4);
  chemAvailability2.endTime = dateAdd(chemAvailability2.startTime, "hour", 3);
  chemAvailability2.facility = Promise.resolve(facility);
  chemAvailability2.bookings = Promise.resolve([chemBooking2]);
  chemAvailability2.price = 20;

  const chemAvailability3 = new AvailabilityEntity();
  chemAvailability3.Date = dateAdd(date1Original, "week", 1);
  chemAvailability3.startTime = dateAdd(chemAvailability3.Date, "hour", 5);
  chemAvailability3.endTime = dateAdd(chemAvailability3.startTime, "hour", 3);
  chemAvailability3.facility = Promise.resolve(facility);
  chemAvailability3.bookings = Promise.resolve([chemBooking3, chemBooking4]);
  chemAvailability3.price = 20;

  const chemAvailability4 = new AvailabilityEntity();
  chemAvailability4.Date = dateAdd(date3Original, "day", 2);
  chemAvailability4.startTime = dateAdd(chemAvailability4.Date, "hour", 6);
  chemAvailability4.endTime = dateAdd(chemAvailability4.startTime, "hour", 3);
  chemAvailability4.facility = Promise.resolve(facility);
  //chemAvailability4.bookings = Promise.resolve([chemBooking4]);
  chemAvailability4.price = 20;

  const chemAvailability5 = new AvailabilityEntity();
  chemAvailability5.Date = dateAdd(date4Original, "month", -3);
  chemAvailability5.startTime = dateAdd(chemAvailability5.Date, "hour", 2);
  chemAvailability5.endTime = dateAdd(chemAvailability5.startTime, "hour", 3);
  chemAvailability5.facility = Promise.resolve(facility);
  chemAvailability5.bookings = Promise.resolve([chemBooking6]);
  chemAvailability5.price = 20;

  const chemAvailability6 = new AvailabilityEntity();
  chemAvailability6.Date = dateAdd(
    dateAdd(date4Original, "month", -1),
    "day",
    -15,
  );
  chemAvailability6.startTime = dateAdd(chemAvailability6.Date, "hour", 6);
  chemAvailability6.endTime = dateAdd(chemAvailability6.startTime, "hour", 3);
  chemAvailability6.facility = Promise.resolve(facility);

  chemAvailability6.price = 20;

  const chemAvailability7 = new AvailabilityEntity();
  chemAvailability7.Date = dateAdd(date5Original, "month", -3);
  chemAvailability7.startTime = dateAdd(chemAvailability7.Date, "hour", 2);
  chemAvailability7.endTime = dateAdd(chemAvailability7.startTime, "hour", 3);
  chemAvailability7.facility = Promise.resolve(facility);
  chemAvailability7.bookings = Promise.resolve([chemBooking5]);
  chemAvailability7.price = 20;

  const chemAvailability8 = new AvailabilityEntity();
  chemAvailability8.Date = dateAdd(
    dateAdd(date5Original, "month", -1),
    "day",
    -25,
  );
  chemAvailability8.startTime = dateAdd(chemAvailability8.Date, "hour", 6);
  chemAvailability8.endTime = dateAdd(chemAvailability8.startTime, "hour", 3);
  chemAvailability8.facility = Promise.resolve(facility);

  chemAvailability8.price = 20;

  const chemAvailability9 = new AvailabilityEntity();
  chemAvailability9.Date = date4Original;
  chemAvailability9.startTime = dateAdd(chemAvailability9.Date, "hour", 6);
  chemAvailability9.endTime = dateAdd(chemAvailability9.startTime, "hour", 3);
  chemAvailability9.facility = Promise.resolve(facility);
  chemAvailability9.bookings = Promise.resolve([chemBooking7]);
  chemAvailability9.price = 20;

  const chemAvailability10 = new AvailabilityEntity();
  chemAvailability10.Date = dateAdd(date4Original, "month", 1);
  chemAvailability10.startTime = dateAdd(chemAvailability10.Date, "hour", 2);
  chemAvailability10.endTime = dateAdd(chemAvailability10.startTime, "hour", 3);
  chemAvailability10.facility = Promise.resolve(facility);

  chemAvailability10.price = 20;

  const chemAvailability11 = new AvailabilityEntity();
  chemAvailability11.Date = dateAdd(date4Original, "month", 2);
  chemAvailability11.startTime = dateAdd(chemAvailability11.Date, "hour", 5);
  chemAvailability11.endTime = dateAdd(chemAvailability11.startTime, "hour", 3);
  chemAvailability11.facility = Promise.resolve(facility);

  chemAvailability11.price = 20;

  const chemAvailability12 = new AvailabilityEntity();
  chemAvailability12.Date = dateAdd(
    dateAdd(date4Original, "month", 2),
    "week",
    2,
  );
  chemAvailability12.startTime = dateAdd(chemAvailability12.Date, "hour", 5);
  chemAvailability12.endTime = dateAdd(chemAvailability12.startTime, "hour", 3);
  chemAvailability12.facility = Promise.resolve(facility);

  chemAvailability12.price = 20;

  const chemAvailability13 = new AvailabilityEntity();
  chemAvailability13.Date = dateAdd(
    dateAdd(date4Original, "month", 3),
    "week",
    1,
  );
  chemAvailability13.startTime = dateAdd(chemAvailability13.Date, "hour", 6);
  chemAvailability13.endTime = dateAdd(chemAvailability13.startTime, "hour", 3);
  chemAvailability13.facility = Promise.resolve(facility);
  chemAvailability13.bookings = Promise.resolve([chemBooking8]);
  chemAvailability13.price = 20;

  const chemAvailability14 = new AvailabilityEntity();
  chemAvailability14.Date = date5Original;
  chemAvailability14.startTime = dateAdd(chemAvailability14.Date, "hour", 1);
  chemAvailability14.endTime = dateAdd(chemAvailability14.startTime, "hour", 3);
  chemAvailability14.facility = Promise.resolve(facility);

  chemAvailability14.price = 20;

  const chemAvailability15 = new AvailabilityEntity();
  chemAvailability15.Date = dateAdd(date5Original, "month", 2);
  chemAvailability15.startTime = dateAdd(chemAvailability15.Date, "hour", 6);
  chemAvailability15.endTime = dateAdd(chemAvailability15.startTime, "hour", 3);
  chemAvailability15.facility = Promise.resolve(facility);

  chemAvailability15.price = 20;

  facility.name = "Chemistry Lab";
  facility.availabilities = Promise.resolve([
    chemAvailability,
    chemAvailability1,
    chemAvailability2,
    chemAvailability3,
    chemAvailability4,
    chemAvailability5,
    chemAvailability6,
    chemAvailability7,
    chemAvailability8,
    chemAvailability9,
    chemAvailability10,
    chemAvailability11,
    chemAvailability12,
    chemAvailability13,
    chemAvailability14,
    chemAvailability15,
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
  booking.facilityId = 0;

  const chemBookingTrans = new TransactionEntity();
  chemBookingTrans.date = booking.startDateTime;
  chemBookingTrans.amountChanged = booking.cost;
  chemBookingTrans.user = user;
  chemBookingTrans.facilityId = booking.facilityId;
  chemBookingTrans.facility = facility;
  chemBookingTrans.booking = booking;
  chemBookingTrans.eventDesription = "Chem Lab booking 1";

  chemBooking1.startDateTime = chemAvailability1.startTime;
  chemBooking1.endDateTime = chemAvailability1.endTime;
  chemBooking1.user = Promise.resolve(user1);
  chemBooking1.availability = Promise.resolve(chemAvailability1);
  chemBooking1.cost = 20;
  chemBooking1.facilityId = 0;

  const chemBookingTrans1 = new TransactionEntity();
  chemBookingTrans1.date = chemBooking1.startDateTime;
  chemBookingTrans1.amountChanged = chemBooking1.cost;
  chemBookingTrans1.user = user1;
  chemBookingTrans1.facilityId = chemBooking1.facilityId;
  chemBookingTrans1.facility = facility;
  chemBookingTrans1.booking = chemBooking1;
  chemBookingTrans1.eventDesription = "Chem Lab booking 2";

  chemBooking2.startDateTime = chemAvailability2.startTime;
  chemBooking2.endDateTime = dateAdd(chemAvailability2.endTime, "hour", -1.5);
  chemBooking2.user = Promise.resolve(user2);
  chemBooking2.availability = Promise.resolve(chemAvailability2);
  chemBooking2.cost = 10;
  chemBooking2.facilityId = 0;

  const chemBookingTrans2 = new TransactionEntity();
  chemBookingTrans2.date = chemBooking2.startDateTime;
  chemBookingTrans2.amountChanged = chemBooking2.cost;
  chemBookingTrans2.user = user2;
  chemBookingTrans2.facilityId = chemBooking2.facilityId;
  chemBookingTrans2.facility = facility;
  chemBookingTrans2.booking = chemBooking2;
  chemBookingTrans2.eventDesription = "Chem Lab booking 3";

  chemBooking3.startDateTime = chemAvailability3.startTime;
  chemBooking3.endDateTime = dateAdd(chemAvailability3.endTime, "hour", -1.5);
  chemBooking3.user = Promise.resolve(user3);
  chemBooking3.availability = Promise.resolve(chemAvailability3);
  chemBooking3.cost = 10;
  chemBooking3.facilityId = 0;

  const chemBookingTrans3 = new TransactionEntity();
  chemBookingTrans3.date = chemBooking3.startDateTime;
  chemBookingTrans3.amountChanged = chemBooking3.cost;
  chemBookingTrans3.user = user3;
  chemBookingTrans3.facilityId = chemBooking3.facilityId;
  chemBookingTrans3.facility = facility;
  chemBookingTrans3.booking = chemBooking3;
  chemBookingTrans3.eventDesription = "Chem Lab booking 4";

  chemBooking4.startDateTime = dateAdd(chemAvailability3.endTime, "hour", -1.5);
  chemBooking4.endDateTime = chemAvailability3.endTime;
  chemBooking4.user = Promise.resolve(user4);
  chemBooking4.availability = Promise.resolve(chemAvailability3);
  chemBooking4.cost = 10;
  chemBooking4.facilityId = 0;

  const chemBookingTrans4 = new TransactionEntity();
  chemBookingTrans4.date = chemBooking4.startDateTime;
  chemBookingTrans4.amountChanged = chemBooking4.cost;
  chemBookingTrans4.user = user4;
  chemBookingTrans4.facilityId = chemBooking4.facilityId;
  chemBookingTrans4.facility = facility;
  chemBookingTrans4.booking = chemBooking4;
  chemBookingTrans4.eventDesription = "Chem Lab booking 5";

  chemBooking5.startDateTime = chemAvailability7.startTime;
  chemBooking5.endDateTime = chemAvailability7.endTime;
  chemBooking5.user = Promise.resolve(user1);
  chemBooking5.availability = Promise.resolve(chemAvailability7);
  chemBooking5.cost = 20;
  chemBooking5.facilityId = 0;

  const chemBookingTrans5 = new TransactionEntity();
  chemBookingTrans5.date = chemBooking5.startDateTime;
  chemBookingTrans5.amountChanged = chemBooking5.cost;
  chemBookingTrans5.user = user1;
  chemBookingTrans5.facilityId = chemBooking5.facilityId;
  chemBookingTrans5.facility = facility;
  chemBookingTrans5.booking = chemBooking5;
  chemBookingTrans5.eventDesription = "Chem Lab booking 5";

  chemBooking6.startDateTime = chemAvailability5.startTime;
  chemBooking6.endDateTime = dateAdd(chemAvailability5.endTime, "hour", -1.5);
  chemBooking6.user = Promise.resolve(user2);
  chemBooking6.availability = Promise.resolve(chemAvailability5);
  chemBooking6.cost = 10;
  chemBooking6.facilityId = 0;

  const chemBookingTrans6 = new TransactionEntity();
  chemBookingTrans6.date = chemBooking6.startDateTime;
  chemBookingTrans6.amountChanged = chemBooking6.cost;
  chemBookingTrans6.user = user2;
  chemBookingTrans6.facilityId = chemBooking6.facilityId;
  chemBookingTrans6.facility = facility;
  chemBookingTrans6.booking = chemBooking6;
  chemBookingTrans6.eventDesription = "Chem Lab booking 6";

  chemBooking7.startDateTime = dateAdd(chemAvailability9.endTime, "hour", -1.5);
  chemBooking7.endDateTime = chemAvailability9.endTime;
  chemBooking7.user = Promise.resolve(user3);
  chemBooking7.availability = Promise.resolve(chemAvailability9);
  chemBooking7.cost = 10;
  chemBooking7.facilityId = 0;

  const chemBookingTrans7 = new TransactionEntity();
  chemBookingTrans7.date = chemBooking7.startDateTime;
  chemBookingTrans7.amountChanged = chemBooking7.cost;
  chemBookingTrans7.user = user3;
  chemBookingTrans7.facilityId = chemBooking7.facilityId;
  chemBookingTrans7.facility = facility;
  chemBookingTrans7.booking = chemBooking7;
  chemBookingTrans7.eventDesription = "Chem Lab booking 7";

  chemBooking8.startDateTime = chemAvailability13.startTime;
  chemBooking8.endDateTime = chemAvailability13.endTime;
  chemBooking8.user = Promise.resolve(user);
  chemBooking8.availability = Promise.resolve(chemAvailability13);
  chemBooking8.cost = 20;
  chemBooking8.facilityId = 0;

  const chemBookingTrans8 = new TransactionEntity();
  chemBookingTrans8.date = chemBooking8.startDateTime;
  chemBookingTrans8.amountChanged = chemBooking8.cost;
  chemBookingTrans8.user = user;
  chemBookingTrans8.facilityId = chemBooking8.facilityId;
  chemBookingTrans8.facility = facility;
  chemBookingTrans8.booking = chemBooking8;
  chemBookingTrans8.eventDesription = "Chem Lab booking 8";

  ////////////// PHYSICS LAB ///////////////////

  const physAvailability = new AvailabilityEntity();
  physAvailability.Date = dateAdd(date3Original, "day", 6);
  physAvailability.startTime = dateAdd(physAvailability.Date, "hour", 6);
  physAvailability.endTime = dateAdd(physAvailability.startTime, "hour", 2);
  physAvailability.facility = Promise.resolve(facility2);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  physAvailability.price = 30;

  const physAvailability1 = new AvailabilityEntity();
  physAvailability1.Date = dateAdd(date1Original, "week", -2);
  physAvailability1.startTime = dateAdd(physAvailability1.Date, "hour", -2);
  physAvailability1.endTime = dateAdd(physAvailability1.startTime, "hour", 2);
  physAvailability1.facility = Promise.resolve(facility2);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  physAvailability1.price = 30;

  const physAvailability2 = new AvailabilityEntity();
  physAvailability2.Date = date3Original;
  physAvailability2.startTime = date3Original;
  physAvailability2.endTime = dateAdd(physAvailability2.startTime, "hour", 2);
  physAvailability2.facility = Promise.resolve(facility2);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  physAvailability2.price = 30;

  const physAvailability3 = new AvailabilityEntity();
  physAvailability3.Date = dateAdd(date3Original, "day", 1);
  physAvailability3.startTime = physAvailability3.Date;
  physAvailability3.endTime = dateAdd(physAvailability3.startTime, "hour", 2);
  physAvailability3.facility = Promise.resolve(facility2);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  physAvailability3.price = 30;

  const physAvailability4 = new AvailabilityEntity();
  physAvailability4.Date = date3Original;
  physAvailability4.startTime = dateAdd(physAvailability4.Date, "hour", 2);
  physAvailability4.endTime = dateAdd(physAvailability4.startTime, "hour", 2);
  physAvailability4.facility = Promise.resolve(facility2);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  physAvailability4.price = 30;

  const physAvailability5 = new AvailabilityEntity();
  physAvailability5.Date = dateAdd(
    dateAdd(date4Original, "month", -1),
    "day",
    -5,
  );
  physAvailability5.startTime = dateAdd(physAvailability5.Date, "hour", 6);
  physAvailability5.endTime = dateAdd(physAvailability5.startTime, "hour", 3);
  physAvailability5.facility = Promise.resolve(facility2);

  physAvailability5.price = 30;

  const physAvailability6 = new AvailabilityEntity();
  physAvailability6.Date = dateAdd(date4Original, "day", -5);
  physAvailability6.startTime = dateAdd(physAvailability6.Date, "hour", 2);
  physAvailability6.endTime = dateAdd(physAvailability6.startTime, "hour", 3);
  physAvailability6.facility = Promise.resolve(facility2);

  physAvailability6.price = 30;

  const physAvailability7 = new AvailabilityEntity();
  physAvailability7.Date = dateAdd(
    dateAdd(date5Original, "month", -3),
    "day",
    3,
  );
  physAvailability7.startTime = dateAdd(physAvailability7.Date, "hour", 6);
  physAvailability7.endTime = dateAdd(physAvailability7.startTime, "hour", 3);
  physAvailability7.facility = Promise.resolve(facility2);

  physAvailability7.price = 30;

  const physAvailability8 = new AvailabilityEntity();
  physAvailability8.Date = dateAdd(
    dateAdd(date5Original, "month", -1),
    "day",
    -15,
  );
  physAvailability8.startTime = dateAdd(physAvailability8.Date, "hour", 6);
  physAvailability8.endTime = dateAdd(physAvailability8.startTime, "hour", 3);
  physAvailability8.facility = Promise.resolve(facility2);

  physAvailability8.price = 30;

  const physAvailability9 = new AvailabilityEntity();
  physAvailability9.Date = dateAdd(date4Original, "day", 12);
  physAvailability9.startTime = dateAdd(physAvailability9.Date, "hour", 6);
  physAvailability9.endTime = dateAdd(physAvailability9.startTime, "hour", 3);
  physAvailability9.facility = Promise.resolve(facility2);

  physAvailability9.price = 30;

  const physAvailability10 = new AvailabilityEntity();
  physAvailability10.Date = dateAdd(
    dateAdd(date4Original, "month", 1),
    "day",
    4,
  );
  physAvailability10.startTime = dateAdd(physAvailability10.Date, "hour", 6);
  physAvailability10.endTime = dateAdd(physAvailability10.startTime, "hour", 3);
  physAvailability10.facility = Promise.resolve(facility2);

  physAvailability10.price = 30;

  const physAvailability11 = new AvailabilityEntity();
  physAvailability11.Date = dateAdd(
    dateAdd(date4Original, "month", 2),
    "day",
    -6,
  );
  physAvailability11.startTime = dateAdd(physAvailability11.Date, "hour", 5);
  physAvailability11.endTime = dateAdd(physAvailability11.startTime, "hour", 3);
  physAvailability11.facility = Promise.resolve(facility2);

  physAvailability11.price = 30;

  const physAvailability12 = new AvailabilityEntity();
  physAvailability12.Date = dateAdd(
    dateAdd(date4Original, "month", 2),
    "week",
    6,
  );
  physAvailability12.startTime = dateAdd(physAvailability12.Date, "hour", 5);
  physAvailability12.endTime = dateAdd(physAvailability12.startTime, "hour", 3);
  physAvailability12.facility = Promise.resolve(facility2);

  physAvailability12.price = 30;

  const physAvailability13 = new AvailabilityEntity();
  physAvailability13.Date = dateAdd(
    dateAdd(date4Original, "month", 3),
    "week",
    8,
  );
  physAvailability13.startTime = dateAdd(physAvailability13.Date, "hour", 2);
  physAvailability13.endTime = dateAdd(physAvailability13.startTime, "hour", 3);
  physAvailability13.facility = Promise.resolve(facility2);

  physAvailability13.price = 30;

  const physAvailability14 = new AvailabilityEntity();
  physAvailability14.Date = dateAdd(
    dateAdd(date5Original, "month", 1),
    "day",
    -2,
  );
  physAvailability14.startTime = dateAdd(physAvailability14.Date, "hour", 1);
  physAvailability14.endTime = dateAdd(physAvailability14.startTime, "hour", 3);
  physAvailability14.facility = Promise.resolve(facility2);

  physAvailability14.price = 30;

  const physAvailability15 = new AvailabilityEntity();
  physAvailability15.Date = dateAdd(
    dateAdd(date5Original, "month", 3),
    "day",
    1,
  );
  physAvailability15.startTime = dateAdd(physAvailability15.Date, "hour", 6);
  physAvailability15.endTime = dateAdd(physAvailability15.startTime, "hour", 3);
  physAvailability15.facility = Promise.resolve(facility2);

  physAvailability15.price = 30;

  facility2.name = "Physics Lab";
  facility2.availabilities = Promise.resolve([
    physAvailability,
    physAvailability1,
    physAvailability2,
    physAvailability3,
    physAvailability4,
    physAvailability5,
    physAvailability6,
    physAvailability7,
    physAvailability8,
    physAvailability9,
    physAvailability10,
    physAvailability11,
    physAvailability12,
    physAvailability13,
    physAvailability14,
    physAvailability15,
  ]);
  //facility.providers = [user];
  facility2.description = "A lab for physics experiments";
  facility2.address = "456 Rutgers Way";
  facility2.balance = 50;
  facility2.equipment = "Resistor, Multimeter, Battery, Spring Scale, etc.";

  physBooking.startDateTime = physAvailability.startTime;
  physBooking.endDateTime = physAvailability.endTime;
  physBooking.user = Promise.resolve(user3);
  physBooking.availability = Promise.resolve(physAvailability);
  physBooking.cost = 30;
  physBooking.facilityId = 0;

  const physBookingTrans = new TransactionEntity();
  physBookingTrans.date = physBooking.startDateTime;
  physBookingTrans.amountChanged = physBooking.cost;
  physBookingTrans.user = user3;
  physBookingTrans.facilityId = physBooking.facilityId;
  physBookingTrans.facility = facility2;
  physBookingTrans.booking = physBooking;
  physBookingTrans.eventDesription = "Physics Lab booking 1";

  physBooking1.startDateTime = physAvailability1.startTime;
  physBooking1.endDateTime = physAvailability1.endTime;
  physBooking1.user = Promise.resolve(user2);
  physBooking1.availability = Promise.resolve(physAvailability1);
  physBooking1.cost = 30;
  physBooking1.facilityId = 0;

  const physBookingTrans1 = new TransactionEntity();
  physBookingTrans1.date = physBooking1.startDateTime;
  physBookingTrans1.amountChanged = physBooking1.cost;
  physBookingTrans1.user = user2;
  physBookingTrans1.facilityId = physBooking1.facilityId;
  physBookingTrans1.facility = facility2;
  physBookingTrans1.booking = physBooking1;
  physBookingTrans1.eventDesription = "Physics Lab booking 2";

  physBooking2.startDateTime = physAvailability4.startTime;
  physBooking2.endDateTime = dateAdd(physAvailability4.endTime, "hour", -1);
  physBooking2.user = Promise.resolve(user1);
  physBooking2.availability = Promise.resolve(physAvailability4);
  physBooking2.cost = 15;
  physBooking2.facilityId = 0;

  const physBookingTrans2 = new TransactionEntity();
  physBookingTrans2.date = physBooking2.startDateTime;
  physBookingTrans2.amountChanged = physBooking2.cost;
  physBookingTrans2.user = user1;
  physBookingTrans2.facilityId = physBooking2.facilityId;
  physBookingTrans2.facility = facility2;
  physBookingTrans2.booking = physBooking2;
  physBookingTrans2.eventDesription = "Physics Lab booking 3";

  physBooking3.startDateTime = dateAdd(physAvailability4.endTime, "hour", -1);
  physBooking3.endDateTime = physAvailability4.endTime;
  physBooking3.user = Promise.resolve(user);
  physBooking3.availability = Promise.resolve(physAvailability4);
  physBooking3.cost = 15;
  physBooking3.facilityId = 0;

  const physBookingTrans3 = new TransactionEntity();
  physBookingTrans3.date = physBooking3.startDateTime;
  physBookingTrans3.amountChanged = physBooking3.cost;
  physBookingTrans3.user = user;
  physBookingTrans3.facilityId = physBooking3.facilityId;
  physBookingTrans3.facility = facility2;
  physBookingTrans3.booking = physBooking3;
  physBookingTrans3.eventDesription = "Physics Lab booking 4";

  physBooking4.startDateTime = physAvailability7.startTime;
  physBooking4.endDateTime = physAvailability7.endTime;
  physBooking4.user = Promise.resolve(user3);
  physBooking4.availability = Promise.resolve(physAvailability7);
  physBooking4.cost = 30;
  physBooking4.facilityId = 0;

  const physBookingTrans4 = new TransactionEntity();
  physBookingTrans4.date = physBooking4.startDateTime;
  physBookingTrans4.amountChanged = physBooking4.cost;
  physBookingTrans4.user = user3;
  physBookingTrans4.facilityId = physBooking4.facilityId;
  physBookingTrans4.facility = facility2;
  physBookingTrans4.booking = physBooking4;
  physBookingTrans4.eventDesription = "Physics Lab booking 5";

  physBooking5.startDateTime = physAvailability9.startTime;
  physBooking5.endDateTime = physAvailability9.endTime;
  physBooking5.user = Promise.resolve(user2);
  physBooking5.availability = Promise.resolve(physAvailability9);
  physBooking5.cost = 30;
  physBooking5.facilityId = 0;

  const physBookingTrans5 = new TransactionEntity();
  physBookingTrans5.date = physBooking5.startDateTime;
  physBookingTrans5.amountChanged = physBooking5.cost;
  physBookingTrans5.user = user2;
  physBookingTrans5.facilityId = physBooking5.facilityId;
  physBookingTrans5.facility = facility2;
  physBookingTrans5.booking = physBooking5;
  physBookingTrans5.eventDesription = "Physics Lab booking 6";

  physBooking6.startDateTime = physAvailability12.startTime;
  physBooking6.endDateTime = dateAdd(physAvailability12.endTime, "hour", -1);
  physBooking6.user = Promise.resolve(user1);
  physBooking6.availability = Promise.resolve(physAvailability12);
  physBooking6.cost = 15;
  physBooking6.facilityId = 0;

  const physBookingTrans6 = new TransactionEntity();
  physBookingTrans6.date = physBooking6.startDateTime;
  physBookingTrans6.amountChanged = physBooking6.cost;
  physBookingTrans6.user = user1;
  physBookingTrans6.facilityId = physBooking6.facilityId;
  physBookingTrans6.facility = facility2;
  physBookingTrans6.booking = physBooking6;
  physBookingTrans6.eventDesription = "Physics Lab booking 7";

  physBooking7.startDateTime = dateAdd(physAvailability14.endTime, "hour", -1);
  physBooking7.endDateTime = physAvailability14.endTime;
  physBooking7.user = Promise.resolve(user);
  physBooking7.availability = Promise.resolve(physAvailability14);
  physBooking7.cost = 15;
  physBooking7.facilityId = 0;

  const physBookingTrans7 = new TransactionEntity();
  physBookingTrans7.date = physBooking7.startDateTime;
  physBookingTrans7.amountChanged = physBooking7.cost;
  physBookingTrans7.user = user;
  physBookingTrans7.facilityId = physBooking7.facilityId;
  physBookingTrans7.facility = facility2;
  physBookingTrans7.booking = physBooking7;
  physBookingTrans7.eventDesription = "Physics Lab booking 8";

  physBooking8.startDateTime = physAvailability11.startTime;
  physBooking8.endDateTime = physAvailability11.endTime;
  physBooking8.user = Promise.resolve(user2);
  physBooking8.availability = Promise.resolve(physAvailability11);
  physBooking8.cost = 30;
  physBooking8.facilityId = 0;

  const physBookingTrans8 = new TransactionEntity();
  physBookingTrans8.date = physBooking8.startDateTime;
  physBookingTrans8.amountChanged = physBooking8.cost;
  physBookingTrans8.user = user2;
  physBookingTrans8.facilityId = physBooking8.facilityId;
  physBookingTrans8.facility = facility2;
  physBookingTrans8.booking = physBooking8;
  physBookingTrans8.eventDesription = "Physics Lab booking 9";

  physBooking9.startDateTime = physAvailability15.startTime;
  physBooking9.endDateTime = dateAdd(physAvailability15.endTime, "hour", -1);
  physBooking9.user = Promise.resolve(user1);
  physBooking9.availability = Promise.resolve(physAvailability15);
  physBooking9.cost = 15;
  physBooking9.facilityId = 0;

  const physBookingTrans9 = new TransactionEntity();
  physBookingTrans9.date = physBooking9.startDateTime;
  physBookingTrans9.amountChanged = physBooking9.cost;
  physBookingTrans9.user = user1;
  physBookingTrans9.facilityId = physBooking9.facilityId;
  physBookingTrans9.facility = facility2;
  physBookingTrans9.booking = physBooking9;
  physBookingTrans9.eventDesription = "Physics Lab booking 10";

  //////////////BIOLOGY///////////////

  const bioAvailability = new AvailabilityEntity();
  bioAvailability.Date = date3Original;
  bioAvailability.startTime = bioAvailability.Date;
  bioAvailability.endTime = dateAdd(bioAvailability.startTime, "hour", 3);
  bioAvailability.facility = Promise.resolve(facility3);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  bioAvailability.price = 60;

  const bioAvailability1 = new AvailabilityEntity();
  bioAvailability1.Date = dateAdd(date3Original, "week", 1);
  bioAvailability1.startTime = dateAdd(bioAvailability1.Date, "hour", 1);
  bioAvailability1.endTime = dateAdd(bioAvailability1.startTime, "hour", 3);
  bioAvailability1.facility = Promise.resolve(facility3);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  bioAvailability1.price = 60;

  const bioAvailability2 = new AvailabilityEntity();
  bioAvailability2.Date = dateAdd(date3Original, "week", 2);
  bioAvailability2.startTime = dateAdd(bioAvailability2.Date, "hour", 2);
  bioAvailability2.endTime = dateAdd(bioAvailability2.startTime, "hour", 3);
  bioAvailability2.facility = Promise.resolve(facility3);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  bioAvailability2.price = 60;

  const bioAvailability3 = new AvailabilityEntity();
  bioAvailability3.Date = dateAdd(date3Original, "week", 3);
  bioAvailability3.startTime = dateAdd(bioAvailability3.Date, "hour", 3);
  bioAvailability3.endTime = dateAdd(bioAvailability3.startTime, "hour", 3);
  bioAvailability3.facility = Promise.resolve(facility3);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  bioAvailability3.price = 60;

  const bioAvailability4 = new AvailabilityEntity();
  bioAvailability4.Date = dateAdd(date3Original, "week", 4);
  bioAvailability4.startTime = dateAdd(bioAvailability4.Date, "hour", 4);
  bioAvailability4.endTime = dateAdd(bioAvailability4.startTime, "hour", 3);
  bioAvailability4.facility = Promise.resolve(facility3);
  //physAvailability.bookings = Promise.resolve([physBooking]);
  bioAvailability4.price = 60;

  const bioAvailability5 = new AvailabilityEntity();
  bioAvailability5.Date = dateAdd(
    dateAdd(date4Original, "month", -2),
    "day",
    -5,
  );
  bioAvailability5.startTime = dateAdd(bioAvailability5.Date, "hour", 6);
  bioAvailability5.endTime = dateAdd(bioAvailability5.startTime, "hour", 3);
  bioAvailability5.facility = Promise.resolve(facility3);

  bioAvailability5.price = 60;

  const bioAvailability6 = new AvailabilityEntity();
  bioAvailability6.Date = dateAdd(date4Original, "day", -25);
  bioAvailability6.startTime = dateAdd(bioAvailability6.Date, "hour", 2);
  bioAvailability6.endTime = dateAdd(bioAvailability6.startTime, "hour", 3);
  bioAvailability6.facility = Promise.resolve(facility3);

  bioAvailability6.price = 60;

  const bioAvailability7 = new AvailabilityEntity();
  bioAvailability7.Date = dateAdd(
    dateAdd(date5Original, "month", -3),
    "day",
    12,
  );
  bioAvailability7.startTime = dateAdd(bioAvailability7.Date, "hour", 6);
  bioAvailability7.endTime = dateAdd(bioAvailability7.startTime, "hour", 3);
  bioAvailability7.facility = Promise.resolve(facility3);

  bioAvailability7.price = 60;

  const bioAvailability8 = new AvailabilityEntity();
  bioAvailability8.Date = dateAdd(
    dateAdd(date5Original, "month", -1),
    "day",
    -17,
  );
  bioAvailability8.startTime = dateAdd(bioAvailability8.Date, "hour", 6);
  bioAvailability8.endTime = dateAdd(bioAvailability8.startTime, "hour", 3);
  bioAvailability8.facility = Promise.resolve(facility3);

  bioAvailability8.price = 60;

  const bioAvailability9 = new AvailabilityEntity();
  bioAvailability9.Date = dateAdd(date4Original, "day", 17);
  bioAvailability9.startTime = dateAdd(bioAvailability9.Date, "hour", 6);
  bioAvailability9.endTime = dateAdd(bioAvailability9.startTime, "hour", 3);
  bioAvailability9.facility = Promise.resolve(facility3);

  bioAvailability9.price = 60;

  const bioAvailability10 = new AvailabilityEntity();
  bioAvailability10.Date = dateAdd(
    dateAdd(date4Original, "month", 1),
    "week",
    2,
  );
  bioAvailability10.startTime = dateAdd(bioAvailability10.Date, "hour", 6);
  bioAvailability10.endTime = dateAdd(bioAvailability10.startTime, "hour", 3);
  bioAvailability10.facility = Promise.resolve(facility3);

  bioAvailability10.price = 60;

  const bioAvailability11 = new AvailabilityEntity();
  bioAvailability11.Date = dateAdd(
    dateAdd(date4Original, "month", 2),
    "day",
    2,
  );
  bioAvailability11.startTime = dateAdd(bioAvailability11.Date, "hour", 5);
  bioAvailability11.endTime = dateAdd(bioAvailability11.startTime, "hour", 3);
  bioAvailability11.facility = Promise.resolve(facility3);

  bioAvailability11.price = 60;

  const bioAvailability12 = new AvailabilityEntity();
  bioAvailability12.Date = dateAdd(
    dateAdd(date4Original, "month", 2),
    "week",
    5,
  );
  bioAvailability12.startTime = dateAdd(bioAvailability12.Date, "hour", 5);
  bioAvailability12.endTime = dateAdd(bioAvailability12.startTime, "hour", 3);
  bioAvailability12.facility = Promise.resolve(facility3);

  bioAvailability12.price = 60;

  const bioAvailability13 = new AvailabilityEntity();
  bioAvailability13.Date = dateAdd(
    dateAdd(date4Original, "month", 3),
    "week",
    6,
  );
  bioAvailability13.startTime = dateAdd(bioAvailability13.Date, "hour", 2);
  bioAvailability13.endTime = dateAdd(bioAvailability13.startTime, "hour", 3);
  bioAvailability13.facility = Promise.resolve(facility3);

  bioAvailability13.price = 60;

  const bioAvailability14 = new AvailabilityEntity();
  bioAvailability14.Date = dateAdd(
    dateAdd(date5Original, "month", 1),
    "day",
    -5,
  );
  bioAvailability14.startTime = dateAdd(bioAvailability14.Date, "hour", 1);
  bioAvailability14.endTime = dateAdd(bioAvailability14.startTime, "hour", 3);
  bioAvailability14.facility = Promise.resolve(facility3);

  bioAvailability14.price = 60;

  const bioAvailability15 = new AvailabilityEntity();
  bioAvailability15.Date = dateAdd(
    dateAdd(date5Original, "month", 3),
    "day",
    12,
  );
  bioAvailability15.startTime = dateAdd(bioAvailability15.Date, "hour", 6);
  bioAvailability15.endTime = dateAdd(bioAvailability15.startTime, "hour", 3);
  bioAvailability15.facility = Promise.resolve(facility3);

  bioAvailability15.price = 60;

  facility3.name = "Biology Center";
  facility3.availabilities = Promise.resolve([
    bioAvailability,
    bioAvailability1,
    bioAvailability2,
    bioAvailability3,
    bioAvailability4,
    bioAvailability5,
    bioAvailability6,
    bioAvailability7,
    bioAvailability8,
    bioAvailability9,
    bioAvailability10,
    bioAvailability11,
    bioAvailability12,
    bioAvailability13,
    bioAvailability14,
    bioAvailability15,
  ]);
  //facility.providers = [user];
  facility3.description = "A lab for biological research";
  facility3.address = "999 Rutgers Way";
  facility3.balance = 150;
  facility3.equipment = "Microscope, Test Tube, Thermometer, Centrifuge, etc.";

  bioBooking.startDateTime = bioAvailability3.startTime;
  bioBooking.endDateTime = dateAdd(bioAvailability3.endTime, "hour", -2);
  bioBooking.user = Promise.resolve(user1);
  bioBooking.availability = Promise.resolve(bioAvailability3);
  bioBooking.cost = 20;
  bioBooking.facilityId = 0;

  const bioBookingTrans = new TransactionEntity();
  bioBookingTrans.date = bioBooking.startDateTime;
  bioBookingTrans.amountChanged = bioBooking.cost;
  bioBookingTrans.user = user1;
  bioBookingTrans.facilityId = bioBooking.facilityId;
  bioBookingTrans.facility = facility3;
  bioBookingTrans.booking = bioBooking;
  bioBookingTrans.eventDesription = "Bio Lab booking 1";

  bioBooking1.startDateTime = dateAdd(bioAvailability3.startTime, "hour", -2);
  bioBooking1.endDateTime = dateAdd(bioAvailability3.endTime, "hour", -1);
  bioBooking1.user = Promise.resolve(user2);
  bioBooking1.availability = Promise.resolve(bioAvailability3);
  bioBooking1.cost = 20;
  bioBooking1.facilityId = 0;

  const bioBookingTrans1 = new TransactionEntity();
  bioBookingTrans1.date = bioBooking1.startDateTime;
  bioBookingTrans1.amountChanged = bioBooking1.cost;
  bioBookingTrans1.user = user2;
  bioBookingTrans1.facilityId = bioBooking1.facilityId;
  bioBookingTrans1.facility = facility3;
  bioBookingTrans1.booking = bioBooking1;
  bioBookingTrans1.eventDesription = "Bio Lab booking 2";

  bioBooking2.startDateTime = dateAdd(bioAvailability3.startTime, "hour", -1);
  bioBooking2.endDateTime = bioAvailability3.endTime;
  bioBooking2.user = Promise.resolve(user3);
  bioBooking2.availability = Promise.resolve(bioAvailability3);
  bioBooking2.cost = 20;
  bioBooking2.facilityId = 0;

  const bioBookingTrans2 = new TransactionEntity();
  bioBookingTrans2.date = bioBooking2.startDateTime;
  bioBookingTrans2.amountChanged = bioBooking2.cost;
  bioBookingTrans2.user = user2;
  bioBookingTrans2.facilityId = bioBooking2.facilityId;
  bioBookingTrans2.facility = facility3;
  bioBookingTrans2.booking = bioBooking2;
  bioBookingTrans2.eventDesription = "Bio Lab booking 3";

  bioBooking3.startDateTime = bioAvailability1.startTime;
  bioBooking3.endDateTime = bioAvailability1.endTime;
  bioBooking3.user = Promise.resolve(user4);
  bioBooking3.availability = Promise.resolve(bioAvailability1);
  bioBooking3.cost = 60;
  bioBooking3.facilityId = 0;

  const bioBookingTrans3 = new TransactionEntity();
  bioBookingTrans3.date = bioBooking3.startDateTime;
  bioBookingTrans3.amountChanged = bioBooking3.cost;
  bioBookingTrans3.user = user4;
  bioBookingTrans3.facilityId = bioBooking3.facilityId;
  bioBookingTrans3.facility = facility3;
  bioBookingTrans3.booking = bioBooking3;
  bioBookingTrans3.eventDesription = "Bio Lab booking 3";

  bioBooking4.startDateTime = bioAvailability4.startTime;
  bioBooking4.endDateTime = bioAvailability4.endTime;
  bioBooking4.user = Promise.resolve(user4);
  bioBooking4.availability = Promise.resolve(bioAvailability4);
  bioBooking4.cost = 60;
  bioBooking4.facilityId = 0;

  const bioBookingTrans4 = new TransactionEntity();
  bioBookingTrans4.date = bioBooking4.startDateTime;
  bioBookingTrans4.amountChanged = bioBooking4.cost;
  bioBookingTrans4.user = user4;
  bioBookingTrans4.facilityId = bioBooking4.facilityId;
  bioBookingTrans4.facility = facility3;
  bioBookingTrans4.booking = bioBooking4;
  bioBookingTrans4.eventDesription = "Bio Lab booking 4";

  bioBooking5.startDateTime = bioAvailability7.startTime;
  bioBooking5.endDateTime = dateAdd(bioAvailability7.endTime, "hour", -2);
  bioBooking5.user = Promise.resolve(user1);
  bioBooking5.availability = Promise.resolve(bioAvailability7);
  bioBooking5.cost = 20;
  bioBooking5.facilityId = 0;

  const bioBookingTrans5 = new TransactionEntity();
  bioBookingTrans5.date = bioBooking5.startDateTime;
  bioBookingTrans5.amountChanged = bioBooking5.cost;
  bioBookingTrans5.user = user1;
  bioBookingTrans5.facilityId = bioBooking5.facilityId;
  bioBookingTrans5.facility = facility3;
  bioBookingTrans5.booking = bioBooking5;
  bioBookingTrans5.eventDesription = "Bio Lab booking 5";

  bioBooking6.startDateTime = dateAdd(bioAvailability13.startTime, "hour", -1);
  bioBooking6.endDateTime = bioAvailability13.endTime;
  bioBooking6.user = Promise.resolve(user3);
  bioBooking6.availability = Promise.resolve(bioAvailability13);
  bioBooking6.cost = 20;
  bioBooking6.facilityId = 0;

  const bioBookingTrans6 = new TransactionEntity();
  bioBookingTrans6.date = bioBooking6.startDateTime;
  bioBookingTrans6.amountChanged = bioBooking6.cost;
  bioBookingTrans6.user = user3;
  bioBookingTrans6.facilityId = bioBooking6.facilityId;
  bioBookingTrans6.facility = facility3;
  bioBookingTrans6.booking = bioBooking6;
  bioBookingTrans6.eventDesription = "Bio Lab booking 6";

  bioBooking7.startDateTime = bioAvailability9.startTime;
  bioBooking7.endDateTime = bioAvailability9.endTime;
  bioBooking7.user = Promise.resolve(user2);
  bioBooking7.availability = Promise.resolve(bioAvailability9);
  bioBooking7.cost = 60;
  bioBooking7.facilityId = 0;

  const bioBookingTrans7 = new TransactionEntity();
  bioBookingTrans7.date = bioBooking7.startDateTime;
  bioBookingTrans7.amountChanged = bioBooking7.cost;
  bioBookingTrans7.user = user2;
  bioBookingTrans7.facilityId = bioBooking7.facilityId;
  bioBookingTrans7.facility = facility3;
  bioBookingTrans7.booking = bioBooking7;
  bioBookingTrans7.eventDesription = "Bio Lab booking 7";

  bioBooking8.startDateTime = dateAdd(bioAvailability12.startTime, "hour", -2);
  bioBooking8.endDateTime = dateAdd(bioAvailability12.endTime, "hour", -1);
  bioBooking8.user = Promise.resolve(user);
  bioBooking8.availability = Promise.resolve(bioAvailability12);
  bioBooking8.cost = 20;
  bioBooking8.facilityId = 0;

  const bioBookingTrans8 = new TransactionEntity();
  bioBookingTrans8.date = bioBooking8.startDateTime;
  bioBookingTrans8.amountChanged = bioBooking8.cost;
  bioBookingTrans8.user = user;
  bioBookingTrans8.facilityId = bioBooking8.facilityId;
  bioBookingTrans8.facility = facility3;
  bioBookingTrans8.booking = bioBooking8;
  bioBookingTrans8.eventDesription = "Bio Lab booking 8";

  bioBooking9.startDateTime = bioAvailability14.startTime;
  bioBooking9.endDateTime = bioAvailability14.endTime;
  bioBooking9.user = Promise.resolve(user1);
  bioBooking9.availability = Promise.resolve(bioAvailability14);
  bioBooking9.cost = 60;
  bioBooking9.facilityId = 0;

  const bioBookingTrans9 = new TransactionEntity();
  bioBookingTrans9.date = bioBooking9.startDateTime;
  bioBookingTrans9.amountChanged = bioBooking9.cost;
  bioBookingTrans9.user = user1;
  bioBookingTrans9.facilityId = bioBooking9.facilityId;
  bioBookingTrans9.facility = facility3;
  bioBookingTrans9.booking = bioBooking9;
  bioBookingTrans9.eventDesription = "Bio Lab booking 9";

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

  const chemFacility = await AppDataSource.getRepository(
    FacilityEntity,
  ).findOneBy({
    name: "Chemistry Lab",
  });
  const physFacility = await AppDataSource.getRepository(
    FacilityEntity,
  ).findOneBy({
    name: "Physics Lab",
  });
  const bioFacility = await AppDataSource.getRepository(
    FacilityEntity,
  ).findOneBy({
    name: "Biology Center",
  });

  booking.facilityId = chemFacility!.id;
  chemBooking1.facilityId = chemFacility!.id;
  chemBooking2.facilityId = chemFacility!.id;
  chemBooking3.facilityId = chemFacility!.id;
  chemBooking4.facilityId = chemFacility!.id;
  physBooking.facilityId = physFacility!.id;
  physBooking1.facilityId = physFacility!.id;
  physBooking2.facilityId = physFacility!.id;
  physBooking3.facilityId = physFacility!.id;
  bioBooking.facilityId = bioFacility!.id;
  bioBooking1.facilityId = bioFacility!.id;
  bioBooking2.facilityId = bioFacility!.id;
  bioBooking3.facilityId = bioFacility!.id;

  //Chem//
  await AppDataSource.manager.save(booking);
  await AppDataSource.manager.save(chemBooking1);
  await AppDataSource.manager.save(chemBooking2);
  await AppDataSource.manager.save(chemBooking3);
  await AppDataSource.manager.save(chemBooking4);
  await AppDataSource.manager.save(chemBooking5);
  await AppDataSource.manager.save(chemBooking6);
  await AppDataSource.manager.save(chemBooking7);
  await AppDataSource.manager.save(chemBooking8);

  //Physics//
  await AppDataSource.manager.save(physBooking);
  await AppDataSource.manager.save(physBooking1);
  await AppDataSource.manager.save(physBooking2);
  await AppDataSource.manager.save(physBooking3);
  await AppDataSource.manager.save(physBooking4);
  await AppDataSource.manager.save(physBooking5);
  await AppDataSource.manager.save(physBooking6);
  await AppDataSource.manager.save(physBooking7);
  await AppDataSource.manager.save(physBooking8);
  await AppDataSource.manager.save(physBooking9);

  //Bio//
  await AppDataSource.manager.save(bioBooking);
  await AppDataSource.manager.save(bioBooking1);
  await AppDataSource.manager.save(bioBooking2);
  await AppDataSource.manager.save(bioBooking3);
  await AppDataSource.manager.save(bioBooking4);
  await AppDataSource.manager.save(bioBooking5);
  await AppDataSource.manager.save(bioBooking6);
  await AppDataSource.manager.save(bioBooking7);
  await AppDataSource.manager.save(bioBooking8);
  await AppDataSource.manager.save(bioBooking9);

  //Transactions//

  //Chem//
  await AppDataSource.manager.save(chemBookingTrans);
  await AppDataSource.manager.save(chemBookingTrans1);
  await AppDataSource.manager.save(chemBookingTrans2);
  await AppDataSource.manager.save(chemBookingTrans3);
  await AppDataSource.manager.save(chemBookingTrans4);
  await AppDataSource.manager.save(chemBookingTrans5);
  await AppDataSource.manager.save(chemBookingTrans6);
  await AppDataSource.manager.save(chemBookingTrans7);
  await AppDataSource.manager.save(chemBookingTrans8);

  //Physicss//
  await AppDataSource.manager.save(physBookingTrans);
  await AppDataSource.manager.save(physBookingTrans1);
  await AppDataSource.manager.save(physBookingTrans2);
  await AppDataSource.manager.save(physBookingTrans3);
  await AppDataSource.manager.save(physBookingTrans4);
  await AppDataSource.manager.save(physBookingTrans5);
  await AppDataSource.manager.save(physBookingTrans6);
  await AppDataSource.manager.save(physBookingTrans7);
  await AppDataSource.manager.save(physBookingTrans8);
  await AppDataSource.manager.save(physBookingTrans9);

  //Bio//
  await AppDataSource.manager.save(bioBookingTrans);
  await AppDataSource.manager.save(bioBookingTrans1);
  await AppDataSource.manager.save(bioBookingTrans2);
  await AppDataSource.manager.save(bioBookingTrans3);
  await AppDataSource.manager.save(bioBookingTrans4);
  await AppDataSource.manager.save(bioBookingTrans5);
  await AppDataSource.manager.save(bioBookingTrans6);
  await AppDataSource.manager.save(bioBookingTrans7);
  await AppDataSource.manager.save(bioBookingTrans8);
  await AppDataSource.manager.save(bioBookingTrans9);

  console.log("DB Finished Populating Bookings!!");
};
