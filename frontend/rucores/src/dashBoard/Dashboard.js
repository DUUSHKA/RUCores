import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import WeeklyCard from "./weeklyCard/weeklyCard";
// import WeeklyCard from './weeklyCard/weeklyCard';
import BookingCalls from "../BookingCalls";
import User from "../UserCalls";

function Dashboard() {
  const [weeklyObject, setWeeklyObject] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  /**
   * finds the date of monday of the current week
   */
  const findCurrentMonday = () => {
    const currentDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    );

    const currentDayOfWeek = currentDate.getDay();

    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const previousMonday = new Date(currentDate);
    previousMonday.setDate(currentDate.getDate() - daysSinceMonday);
    previousMonday.setHours(0, 0, 0, 0);

    return previousMonday;
  };

  /**
   * finds the next sunday from the monday
   */
  const findSunday = (previousMonday) => {
    const followingSunday = new Date(previousMonday);
    followingSunday.setDate(previousMonday.getDate() + 6); // Adding 6 days to get to Sunday

    // Set the time to 23:59:59.999 in Eastern Daylight Time (EDT)
    followingSunday.setHours(23, 59, 59, 999);

    // Explicitly set the time zone to America/New_York (Eastern Daylight Time)
    followingSunday.toLocaleString("en-US", { timeZone: "America/New_York" });

    return followingSunday;
  };

  const filterDatesInWeekRange = (bookingsArray, startRange, endRange) => {
    console.log("here");
    return bookingsArray.filter((booking) => {
      console.log(booking);
      const startDateTime = new Date(booking.startDateTime);
      if (startDateTime >= startRange && startDateTime <= endRange) {
        return booking;
      }
    });
  };

  const allocateBookingsToDays = (currentWeekBookings, weekBookingObject) => {
    // Iterate through each booking in the currentWeekBookings array
    currentWeekBookings.forEach((booking) => {
      // Extract the day of the week from the booking's startDateTime
      const bookingDayOfWeek = new Date(booking.startDateTime).getDay();
      console.log(bookingDayOfWeek);
      // Get the corresponding day key (e.g., "Monday", "Tuesday", etc.)
      const dayKey = Object.keys(weekBookingObject)[bookingDayOfWeek];

      // Allocate the booking to the respective day array
      weekBookingObject[dayKey].push(booking);
    });

    return weekBookingObject;
  };

  useEffect(() => {
    const APICall = new BookingCalls();
    APICall.getBookingsByUser(50, 0).then((bookings) => {
      console.log(bookings);
      const mondaysDate = findCurrentMonday();
      const sundaysDate = findSunday(mondaysDate);

      if (bookings) {
        console.log(filterDatesInWeekRange(bookings, mondaysDate, sundaysDate));
        const currentWeekBookings = filterDatesInWeekRange(
          bookings,
          mondaysDate,
          sundaysDate,
        );
        const weekBookingObject = {
          1: [], //m
          2: [], //Tues
          3: [], //Wed
          4: [], //thurs
          5: [], //fri
          6: [], //sat
          0: [], //sun
        };
        const updatedWeekBookingObject = allocateBookingsToDays(
          currentWeekBookings,
          weekBookingObject,
        );
        setWeeklyObject(updatedWeekBookingObject);
      }
    });

    const UserCall = new User();
    UserCall.getUserByID(
      parseInt(window.sessionStorage.getItem("id"), 10),
    ).then((resp) => {
      setCurrentBalance(resp.balance);
    });
  }, []);

  /**
   * sample transactionHistory Data
   */
  const transactionHistoryData = {
    history: [
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
      "spent xx coins on mm-dd-yy",
    ],
  };

  /**
   * transactionList
   */
  const transactionListItems = transactionHistoryData.history.map(
    (transaction, index) => {
      if (index < 4) {
        return <ListGroup.Item key={index}>{transaction}</ListGroup.Item>;
      } else {
        return null;
      }
    },
  );

  const isProvider = window.sessionStorage.getItem("isProvider") === "true";

  return (
    <>
      <div className="dashboard">
        <h1 className="dashboardH1">Dashboard</h1>
        <div className="dashboard-sections">
          <section className="balance">
            <h2 className="dashBoardH2">RU Coin Balance</h2>
            {currentBalance ? (
              <p>{currentBalance} RU Coins</p>
            ) : (
              <p>Loading...</p>
            )}{" "}
            {/* Placeholder value */}
            <Link to="/wallet">
              <Button variant="link">View Wallet</Button>
            </Link>
          </section>
          <section className="transactions">
            <h2 className="dashBoardH2">Recent Transactions</h2>
            <div>
              <ListGroup className="HistoryList" variant="flush">
                {transactionListItems}
              </ListGroup>
              <Link to="/wallet">
                <Button variant="link">View All Transactions</Button>
              </Link>
            </div>
          </section>
          {isProvider && (
            <section className="bookings">
              <h2 className="dashBoardH2">Your Facilities</h2>
              <ul>
                {/* Placeholder bookings*/}
                <li>Lab A - Chemistry </li>
                <li>Lab B - Biology </li>
              </ul>
            </section>
          )}

          {}
        </div>
      </div>
      <div className="weekCard">
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>MONDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[1] && weeklyObject[1].length > 0 ? (
              weeklyObject[1].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>TUESDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[2] && weeklyObject[2].length > 0 ? (
              weeklyObject[2].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>WEDNESDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[3] && weeklyObject[3].length > 0 ? (
              weeklyObject[3].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>THURSDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[4] && weeklyObject[4].length > 0 ? (
              weeklyObject[4].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>FRIDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[5] && weeklyObject[5].length > 0 ? (
              weeklyObject[5].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>SATURDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[6] && weeklyObject[6].length > 0 ? (
              weeklyObject[6].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
        <div className="WeeklyCard">
          <div className="WeeklyCardTitle">
            <h3>SUNDAY</h3>
          </div>
          <div className="WeeklyCardContent">
            {weeklyObject && weeklyObject[0] && weeklyObject[0].length > 0 ? (
              weeklyObject[0].map((item, index) => (
                <WeeklyCard key={index} bookingInfo={item} />
              ))
            ) : (
              <p>No Bookings</p>
            )}
          </div>
        </div>
      </div>
      <Link to="/schedule">
        <Button>View More</Button>
      </Link>
    </>
  );
}

export default Dashboard;
