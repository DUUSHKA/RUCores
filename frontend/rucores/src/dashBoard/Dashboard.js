import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import WeeklyCard from "./weeklyCard/weeklyCard";
// import WeeklyCard from './weeklyCard/weeklyCard';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import BookingCalls from "../BookingCalls";
import FacilityCalls from "../FacilityCalls";
import User from "../UserCalls";
import Transaction from "../transactionCalls";

function Dashboard() {
  const [weeklyObject, setWeeklyObject] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  const [userFacilities, setUserFacilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [facilitiesPerPage] = useState(5);
  const [transactionData, setTransactionData] = useState([]);
  const [history, setTransactionHistory] = useState([]);
  const [transactionListItems, setTransactionListItems] = useState();
  const navigate = useNavigate();
  const facilityAPI = new FacilityCalls();
  const userId = parseInt(window.sessionStorage.getItem("id"), 10);
  const isProvider = window.sessionStorage.getItem("isProvider") === "true";
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

      // Only fetch managed facilities if the user is a provider
      if (isProvider) {
        const fetchManagedFacilities = async () => {
          try {
            const facilities = await facilityAPI.getManagedFacilities();
            setUserFacilities(facilities);
          } catch (error) {
            console.error("Failed to fetch managed facilities:", error);
            // Optionally handle the error, e.g., by setting an error state or logging
          }
        };

        fetchManagedFacilities();
      }

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
    const transactionAPI = new Transaction();
    transactionAPI.getAllTransactions(4, 0, "date", "DESC").then((resp) => {
      setTransactionData(resp);
    });
  }, [userId, isProvider]);

  useEffect(() => {
    if (transactionData) {
      setTransactionHistory(
        transactionData.map((item) => [
          `${item.transactionType} ${item.amountChanged} RU Coins ${new Date(
            item.date,
          ).toLocaleString()}`,
          item,
        ]),
      );
    }
  }, [transactionData]);

  useEffect(() => {
    if (history) {
      setTransactionListItems(
        history.map((transaction, index) => {
          return (
            <div key={index}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip id="button-tooltip-2">{`${transaction[1].amountChanged} RU Coins - ${transaction[1]?.facility?.name || "Purchase"}`}</Tooltip>
                }
              >
                <ListGroup.Item className="historyListItem">
                  {transaction[0]}
                </ListGroup.Item>
              </OverlayTrigger>
            </div>
          );
        }),
      );
    }
  }, [history]);

  const fetchUserFacilities = async () => {
    const FacilityAPI = new FacilityCalls();
    const userId = parseInt(window.sessionStorage.getItem("id"), 10);
    const facilities = await FacilityAPI.getFacilitiesByUserId(userId);
    if (facilities) {
      setUserFacilities(facilities);
    }
  };

  const handleDeleteFacility = async (facilityId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this facility?",
    );
    if (confirmDelete) {
      const FacilityAPI = new FacilityCalls();
      const success = await FacilityAPI.deleteFacility(facilityId);
      if (success) {
        alert("Facility deleted successfully.");
        fetchUserFacilities(); // Refresh the list of facilities
      } else {
        alert("Failed to delete facility.");
      }
    }
  };

  /**
   * sample transactionHistory Data
   
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
*/
  const indexOfLastFacility = currentPage * facilitiesPerPage;
  const indexOfFirstFacility = indexOfLastFacility - facilitiesPerPage;
  const currentFacilities = userFacilities.slice(
    indexOfFirstFacility,
    indexOfLastFacility,
  );

  const totalPages = Math.ceil(userFacilities.length / facilitiesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <li key={number} className="page-item">
        <Button className="page-link" onClick={() => setCurrentPage(number)}>
          {number}
        </Button>
      </li>
    ));
  };

  const facilitiesList = currentFacilities.map((facility) => (
    <ListGroup.Item key={facility.id}>
      <div className="facility-item">
        <span>{facility.name}</span>
        <div>
          <Button
            variant="info"
            onClick={() => navigate(`/editFacility/${facility.id}`)}
          >
            Edit Facility
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteFacility(facility.id)}
          >
            Delete Facility
          </Button>
        </div>
      </div>
    </ListGroup.Item>
  ));

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
            {transactionListItems && transactionListItems.length > 0 ? (
              <div>
                <ListGroup className="HistoryList" variant="flush">
                  {transactionListItems}
                </ListGroup>
                <Link to="/wallet">
                  <Button variant="link">View All Transactions</Button>
                </Link>
              </div>
            ) : (
              <p>No transactions available.</p>
            )}
          </section>
          {isProvider && (
            <section className="facilities">
              <h2 className="dashBoardH2">Your Facilities</h2>
              <ListGroup>
                {facilitiesList.length > 0 ? (
                  facilitiesList
                ) : (
                  <p>You currently do not manage any facilities.</p>
                )}
              </ListGroup>
              <nav>
                <ul className="pagination">{renderPageNumbers()}</ul>
              </nav>
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
