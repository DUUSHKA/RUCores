/* eslint-disable react/prop-types */
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import React, { useEffect, useState } from "react";
import "./booking.css";
import CurrentBooking from "./currentBooking/currentBooking";

function Booking(props) {
  const [bookingData, setBookingData] = useState();
  const [dates, setDates] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState();

  useEffect(() => {
    setIsLoading(true);

    const fetchAvailability = async (facilityID) => {
      try {
        const url = `http://localhost:3001/api/availability/facility/${facilityID}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        console.log("Availability data:", data);
        setBookingData(data);
        const arrayOfDates = data.map((obj) => {
          const isoDate = obj.Date; // Assuming "Date" field is present in each object
          const yyyyMMdd = isoDate.split("T")[0]; // Extract YYYY-MM-DD
          return yyyyMMdd;
        });
        console.log(arrayOfDates);
        setDates(arrayOfDates);
        console.log(bookingData);
        return data;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchHighlightedDays = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        await fetchAvailability(props.facilityID);
      } catch (error) {
        console.error("Error fetching highlighted days:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightedDays();
  }, [props.facilityID]); // Only re-run effect if props.facilityID changes

  useEffect(() => {
    console.log("Current Booking:", currentBooking);
  }, [currentBooking]); // Log when currentBooking changes

  const handleDayClick = (date) => {
    console.log("Clicked date:", date.format("YYYY-MM-DD"));
    const index = dates.indexOf(date.format("YYYY-MM-DD"));
    setCurrentBooking(bookingData[index]);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {dates && (
          <DateCalendar
            loading={isLoading}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: (props) => {
                const { day, outsideCurrentMonth, ...other } = props;
                const isSelected =
                  !outsideCurrentMonth &&
                  dates.includes(day.format("YYYY-MM-DD"));

                return (
                  <Badge
                    key={day.toString()}
                    overlap="circular"
                    badgeContent={isSelected ? "✔️" : undefined}
                    onClick={() => handleDayClick(day)}
                  >
                    <PickersDay
                      {...other}
                      outsideCurrentMonth={outsideCurrentMonth}
                      day={day}
                    />
                  </Badge>
                );
              },
            }}
          />
        )}
      </LocalizationProvider>
      {currentBooking && (
        <div>
          <CurrentBooking currentBooking={currentBooking} />
        </div>
      )}
      {!currentBooking && <h2>Select A valid Date to book</h2>}
    </>
  );
}

export default Booking;
