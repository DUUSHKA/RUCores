import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
// import Button from "react-bootstrap/esm/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Button from "react-bootstrap/esm/Button";
import "./createBooking.css";
import SuccessFailureAlert from "../../../../../SuccessFailureAlerts";
function CreateBooking(props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [bookingStart, setBookingStart] = React.useState(
    dayjs(props.currentAvail.startTime),
  );
  const [bookingEnd, setBookingEnd] = React.useState(
    dayjs(props.currentAvail.endTime),
  );

  const [alreadySetBookings, setAlreadySetBookings] = React.useState();
  // eslint-disable-next-line no-unused-vars
  const [invalidTimes, setinValidTimes] = React.useState([]);

  const [elapsedTime, setElapsedTime] = React.useState();
  const [cost, setCost] = React.useState();
  const [availId, setAvailId] = React.useState();

  const currentAvail = props.currentAvail;
  const formatTime = (timeString) => {
    const formattedTime = new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

  useEffect(() => {
    setBookingStart(dayjs(props.currentAvail.startTime));
    setBookingEnd(dayjs(props.currentAvail.endTime));
  }, [props.currentAvail.startTime, props.currentAvail.endTime]);

  const determineaAvialibleBookingTimes = () => {
    if (alreadySetBookings) {
      const invalidTimesTemp = [];
      for (let i = 0; i < alreadySetBookings.length; i++) {
        let booking = alreadySetBookings[i];
        let startTime = formatTime(booking.startDateTime);
        let endTime = formatTime(booking.endDateTime);
        invalidTimesTemp.push(startTime + "-" + endTime);
      }
      setinValidTimes(invalidTimesTemp);
    }
  };

  const calculateElapsedTime = () => {
    const startTime = dayjs(bookingStart).format("HH:mm");
    const endTime = dayjs(bookingEnd).format("HH:mm");
    const elapsedTimeInHours = dayjs(endTime, "HH:mm").diff(
      dayjs(startTime, "HH:mm"),
      "hours",
      true,
    );
    setElapsedTime(elapsedTimeInHours);
  };

  const closeAlert = () => {
    setShowSuccess(false);
    setShowError(true);
  };
  /**
   * ran on component loading
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = props.currentAvail.id;

        const url = `http://localhost:3001/api/booking/availabilityID/${id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        setAlreadySetBookings(data);

        determineaAvialibleBookingTimes();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [props.currentAvail.id]);

  const calculateCost = () => {
    if (!isNaN(props.currentAvail.price)) {
      setCost(elapsedTime * props.currentAvail.price * 2);
    } else {
      setCost(0); // Or handle the case when price is not a number
    }
  };

  useEffect(() => {
    calculateElapsedTime();
  }, [bookingStart, bookingEnd]);

  useEffect(() => {
    calculateCost();
  }, [elapsedTime]);

  useEffect(() => {
    determineaAvialibleBookingTimes(alreadySetBookings);
  }, [alreadySetBookings]);

  useEffect(() => {
    setAvailId(props.currentAvail.id);
  }, [props.currentAvail.id]);

  const formatToISOString = (date) => {
    return date.toISOString().slice(0, 19) + ".000Z";
  };

  const handlePostRequest = async () => {
    const userId = parseInt(window.sessionStorage.getItem("id"));
    const id = availId;
    try {
      const postData = {
        startDateTime: formatToISOString(bookingStart),
        endDateTime: formatToISOString(bookingEnd),
        user_id: userId,
        availability_id: id,
      };

      const url = "http://localhost:3001/api/booking";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        setShowError(true);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const result = await response.json();
      setShowSuccess(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="current-booking-container">
        <h2>Current Booking Details</h2>
        <p>
          <strong>Availability Start Time:</strong>{" "}
          {formatTime(currentAvail.startTime)}
        </p>
        <p>
          <strong>Availability End Time:</strong>{" "}
          {formatTime(currentAvail.endTime)}
        </p>
        <p>
          <strong>Invalid Bookings:</strong> {invalidTimes}
        </p>
        <p>
          <strong>Elapsed Time:</strong> {elapsedTime} hours
        </p>
        <p>
          <strong>Total Price:</strong> {cost} RU Coins
        </p>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Start Time"
          value={bookingStart}
          onChange={(newValue) => {
            setBookingStart(newValue);
          }}
          minutesStep={30}
        />
        <TimePicker
          label="End Time"
          value={bookingEnd}
          onChange={(newValue) => {
            setBookingEnd(newValue);
          }}
          minutesStep={30}
        />
      </LocalizationProvider>
      <Button onClick={handlePostRequest}>Complete Booking</Button>
      <SuccessFailureAlert
        variant={"success"}
        show={showSuccess}
        alertText={"Successfully Created Booking!"}
        onClose={closeAlert}
      ></SuccessFailureAlert>
            <SuccessFailureAlert
        variant={"danger"}
        show={showError}
        alertText={"Failed to Create Booking!"}
        onClose={closeAlert}
      ></SuccessFailureAlert>
    </>
  );
}

CreateBooking.propTypes = {
  currentAvail: PropTypes.object,
};

export default CreateBooking;
