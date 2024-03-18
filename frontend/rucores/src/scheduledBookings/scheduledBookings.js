import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import BookingCalls from "../BookingCalls";
import SuccessFailureAlert from "../SuccessFailureAlerts";

const localizer = momentLocalizer(moment);

function ScheduledBookings() {
  const [showModals, setShowModals] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [events, setEvents] = useState([]);

  const handleAlertCloseSuccess = () => {
    setSuccess(false);
  };

  const handleAlertCloseFail = () => {
    setError(false);
  };

  const handleClose = () => setShowModals([]);
  const handleShow = (booking) => {
    setSelectedBooking(booking);
    setShowModals([booking.id]);
  };

  useEffect(() => {
    const bookingAPI = new BookingCalls();
    bookingAPI.getBookingsByUser(30, 0, "DESC").then((bookingsFromCall) => {
      const formattedEvents = bookingsFromCall.map((booking) => ({
        title: booking.__availability__.__facility__
          ? booking.__availability__.__facility__.name
          : "Deleted",
        start: new Date(booking.startDateTime),
        end: new Date(booking.endDateTime),
        resource: booking,
      }));
      setEvents(formattedEvents);
    });
  }, []);

  const deleteBooking = async (item) => {
    const bookingAPI = new BookingCalls();

    try {
      if (item) {
        const isDeleted = await bookingAPI.deleteBookingbybookingID(item.id);
        console.log(isDeleted);
        if (isDeleted) {
          setSuccess(true);

          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.resource.id !== item.id),
          );
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      setError(true);
    }
  };

  const formatDate = (originalDateString) => {
    const originalDate = new Date(originalDateString);
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return originalDate.toLocaleString("en-US", options);
  };

  return (
    <>
      <div className="centerBookingsList">
        <h1>Scheduled Bookings</h1>
        {}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "900px", margin: "50px" }}
          onSelectEvent={(event) => handleShow(event.resource)}
        />
      </div>
      {}
      {selectedBooking && (
        <Modal
          show={showModals.includes(selectedBooking.id)}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedBooking.__availability__.__facility__
                ? selectedBooking.__availability__.__facility__.name
                : "Deleted"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h2>Current Booking Details</h2>
              <p>
                <strong>Booking Start Date/Time:</strong>{" "}
                {formatDate(selectedBooking.startDateTime)}
              </p>
              <p>
                <strong>Booking End Date/Time:</strong>{" "}
                {formatDate(selectedBooking.endDateTime)}
              </p>
              <p>
                <strong>Booking Cost:</strong> {selectedBooking.cost}
              </p>
            </div>
            <div>
              <h2>Facility Details</h2>
              <p>
                <strong>Facility Address:</strong>{" "}
                {selectedBooking.__availability__.__facility__
                  ? selectedBooking.__availability__.__facility__.address
                  : "Loading"}
              </p>
              <p>
                <strong>Facility Description:</strong>{" "}
                {selectedBooking.__availability__.__facility__
                  ? selectedBooking.__availability__.__facility__.description
                  : "Loading"}
              </p>
              <p>
                <strong>Facility Equipment:</strong>{" "}
                {selectedBooking.__availability__.__facility__
                  ? selectedBooking.__availability__.__facility__.equipment
                  : "Loading"}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {success && (
              <SuccessFailureAlert
                variant="success"
                alertText="Successfully Deleted Booking"
                show={success}
                onClose={handleAlertCloseSuccess}
              />
            )}
            {error && (
              <SuccessFailureAlert
                variant="danger"
                alertText="Error Deleting Booking"
                show={error}
                onClose={handleAlertCloseFail}
              />
            )}
            {!error && !success && (
              <Button
                variant="secondary"
                onClick={async () => {
                  await deleteBooking(selectedBooking);
                }}
              >
                Cancel Booking
              </Button>
            )}
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default ScheduledBookings;
