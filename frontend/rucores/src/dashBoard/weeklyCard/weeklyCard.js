import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import BookingCalls from "../../BookingCalls";
import SuccessFailureAlert from "../../SuccessFailureAlerts";
import "./weeklyCard.css";

function WeeklyCard(props) {
  /**
   * use state for modal
   */
  const [show, setShow] = useState(false);

  const [booking, setBooking] = useState();

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  /**
   *
   * @returns function for show and unshow
   */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * used to format date
   * takes in original date string
   * returns date
   */
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

  const cardObj = {
    cardTitle: booking
      ? `${booking.__availability__.__facility__.name}`
      : "Loading",
    subtitle: booking
      ? `${booking.__availability__.__facility__.address}`
      : "Loading",
    description: booking
      ? `${formatDate(booking.startDateTime)} - ${formatDate(booking.endDateTime)}`
      : "Loading",
  };

  const deleteBooking = async () => {
    const bookingAPI = new BookingCalls();

    try {
      if (booking) {
        const isDeleted = await bookingAPI.deleteBookingbybookingID(booking.id);
        if (isDeleted) {
          setSuccess(true);
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

  const handleAlertCloseSuccess = () => {
    setSuccess(false);
  };

  const handleAlertCloseFail = () => {
    setError(false);
  };

  useEffect(() => {
    setBooking(props.bookingInfo);
  }, [props.bookingInfo]);

  return (
    <>
      {/* <SuccessFailureAlert variant="danger" alertText="opened" show={error}></SuccessFailureAlert> */}
      <Card style={{ width: "100%" }}>
        <Card.Body>
          <Card.Title>{cardObj.cardTitle}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {cardObj.subtitle}
          </Card.Subtitle>
          <Card.Text>{cardObj.description}</Card.Text>
          <Card.Link style={{ cursor: "pointer" }} onClick={handleShow}>
            View More
          </Card.Link>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{cardObj.cardTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h2>Current Booking Details</h2>
            <p>
              <strong>Booking Start Date/Time:</strong>{" "}
              {booking ? formatDate(booking.startDateTime) : "Loading"}
            </p>
            <p>
              <strong>Booking End Date/Time:</strong>{" "}
              {booking ? formatDate(booking.endDateTime) : "Loading"}
            </p>
            <p>
              <strong>Booking Cost:</strong>{" "}
              {booking ? booking.cost : "Loading"}
            </p>
          </div>
          <div>
            <h2>Facility Details</h2>
            <p>
              <strong>Facility Address:</strong>{" "}
              {booking
                ? booking.__availability__.__facility__.address
                : "Loading"}
            </p>
            <p>
              <strong>Facility Description:</strong>{" "}
              {booking
                ? booking.__availability__.__facility__.description
                : "Loading"}
            </p>
            <p>
              <strong>Facility Equipment:</strong>{" "}
              {booking
                ? booking.__availability__.__facility__.equipment
                : "Loading"}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {success && (
            <SuccessFailureAlert
              variant="success"
              alertText="SuccessFully Deleted Booking"
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
          {(!error || !success) && (
            <Button
              variant="secondary"
              onClick={async () => {
                await deleteBooking();
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
    </>
  );
}
WeeklyCard.propTypes = {
  bookingInfo: PropTypes.object,
};

export default WeeklyCard;
