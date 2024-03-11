import React, { useState } from "react";
import "./Facility.css";
import PropTypes from "prop-types";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Booking from "./booking/booking";
function FacilityInfo(prop) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const facilityDetails = {
    name: prop.facilityDetails.name,
    equipment: prop.facilityDetails.equipment,
    address: prop.facilityDetails.address,
    description: prop.facilityDetails.description,
    id: prop.facilityDetails.id,
  };

  // eslint-disable-next-line no-unused-vars
  const getFacilityInfo = () => {
    const fetchAvailabilityData = async () => {
      try {
        const facilityId = facilityDetails.id; // Replace with the actual facility ID you want to retrieve

        const url = `http://localhost:3001/api/availability/facility/${facilityId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          credentials: "include", // Include this line if you need to send cookies or credentials
        });

        if (!response.ok) {
          throw new Error("Failed to fetch availability data");
        }

        // eslint-disable-next-line no-unused-vars
        const data = await response.json();
        handleShow();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the fetchAvailabilityData function
    fetchAvailabilityData();
  };

  return (
    <>
      <div className="facilityInfo">
        <h1>{facilityDetails.name}</h1>
        <p>
          <strong>Description:</strong> {facilityDetails.description}
        </p>
        <p>
          <strong>Available Equipment:</strong> {facilityDetails.equipment}
        </p>
        <p>
          <strong>Address:</strong> {facilityDetails.address}
        </p>
        <p className="cost">
          <Button onClick={getFacilityInfo}>Schedule a Booking</Button>
        </p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="enlargeModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Booking for {facilityDetails.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Booking facilityID={facilityDetails.id} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
FacilityInfo.propTypes = {
  facilityDetails: PropTypes.object,
};
export default FacilityInfo;
