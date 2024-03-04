import PropTypes from "prop-types";
import React from "react";
import Button from "react-bootstrap/esm/Button";
import "./currentBooking.css";

function CurrentBooking(props) {
  const currentBooking = props.currentBooking;
  console.log(currentBooking);
  const calculateElapsedTime = () => {
    const startTime = new Date(currentBooking.startTime);
    const endTime = new Date(currentBooking.endTime);
    const elapsedTimeInMilliseconds = endTime - startTime;
    const elapsedTimeInMinutes = elapsedTimeInMilliseconds / (1000 * 60);
    return elapsedTimeInMinutes;
  };

  const calculateTotalPrice = () => {
    const elapsedTimeInMinutes = calculateElapsedTime();
    const pricePerMinute = currentBooking.price / 30; // Assuming the price is for 30 minutes
    return elapsedTimeInMinutes * pricePerMinute;
  };

  const formatTime = (timeString) => {
    const formattedTime = new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

  // eslint-disable-next-line no-unused-vars
  function roundToNearestMinutes(date, nearestTo, isEndTime) {
    const roundedMinutes = isEndTime
      ? Math.round(date.getMinutes() / nearestTo) * nearestTo - 30
      : Math.round(date.getMinutes() / nearestTo) * nearestTo;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  const formatToISOString = (date) => {
    return date.toISOString().slice(0, 19) + ".000Z";
  };

  const handlePostRequest = async () => {
    const userId = parseInt(window.sessionStorage.getItem("id"));
    console.log(window.sessionStorage.getItem("id"));

    // Round startDateTime up and endDateTime down to the nearest 30-minute increment
    const roundedStartTime = roundToNearestMinutes(
      new Date(currentBooking.startTime),
      30,
      false,
    );
    const roundedEndTime = roundToNearestMinutes(
      new Date(currentBooking.endTime),
      30,
      true,
    );

    try {
      const postData = {
        startDateTime: formatToISOString(roundedStartTime),
        endDateTime: formatToISOString(roundedEndTime),
        user_id: userId,
        availability_id: 1,
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
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="current-booking-container">
        <h2>Current Booking Details</h2>
        <p>
          <strong>Start Time:</strong> {formatTime(currentBooking.startTime)}
        </p>
        <p>
          <strong>End Time:</strong> {formatTime(currentBooking.endTime)}
        </p>
        <p>
          <strong>Elapsed Time:</strong> {calculateElapsedTime()} minutes
        </p>
        <p>
          <strong>Total Price:</strong> ${calculateTotalPrice().toFixed(2)}
        </p>
      </div>
      <Button onClick={handlePostRequest}>Complete Booking</Button>
    </>
  );
}

CurrentBooking.propTypes = {
  currentBooking: PropTypes.object,
};

export default CurrentBooking;
