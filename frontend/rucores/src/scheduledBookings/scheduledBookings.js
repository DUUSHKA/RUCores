import React, { useEffect, useState } from "react";
import BookingCalls from "../BookingCalls";
import ListGroup from "react-bootstrap/ListGroup";
import "./scheduleBookings.css";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import SuccessFailureAlert from "../SuccessFailureAlerts";

function ScheduledBookings() {
  const [bookings, setBookings] = useState([]);
  const [showModals, setShowModals] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setBookings(bookingsFromCall);
      setShowModals(new Array(bookingsFromCall.length).fill(false));
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
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== item.id),
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
        <ListGroup as="ul">
          {bookings &&
            bookings.length > 0 &&
            bookings.map((item, index) => (
              <ListGroup.Item key={index}>
                {item.__availability__.__facility__.name}
                {item.__availability__.__facility__.address}
                {formatDate(item.startDateTime) +
                  " - " +
                  formatDate(item.endDateTime)}
                <Button variant="link" onClick={() => handleShow(item)}>
                  Manage and View Booking
                </Button>
                <Modal show={showModals[index]} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {item.__availability__.__facility__.name}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <h2>Current Booking Details</h2>
                      <p>
                        <strong>Booking Start Date/Time:</strong>{" "}
                        {item ? formatDate(item.startDateTime) : "Loading"}
                      </p>
                      <p>
                        <strong>Booking End Date/Time:</strong>{" "}
                        {item ? formatDate(item.endDateTime) : "Loading"}
                      </p>
                      <p>
                        <strong>Booking Cost:</strong>{" "}
                        {item ? item.cost : "Loading"}
                      </p>
                    </div>
                    <div>
                      <h2>Facility Details</h2>
                      <p>
                        <strong>Facility Address:</strong>{" "}
                        {item
                          ? item.__availability__.__facility__.address
                          : "Loading"}
                      </p>
                      <p>
                        <strong>Facility Description:</strong>{" "}
                        {item
                          ? item.__availability__.__facility__.description
                          : "Loading"}
                      </p>
                      <p>
                        <strong>Facility Equipment:</strong>{" "}
                        {item
                          ? item.__availability__.__facility__.equipment
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
                      ></SuccessFailureAlert>
                    )}
                    {error && (
                      <SuccessFailureAlert
                        variant="danger"
                        alertText="Error Deleting Booking"
                        show={error}
                        onClose={handleAlertCloseFail}
                      ></SuccessFailureAlert>
                    )}
                    {!error && !success && (
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          await deleteBooking(item);
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
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    </>
  );
}

export default ScheduledBookings;
