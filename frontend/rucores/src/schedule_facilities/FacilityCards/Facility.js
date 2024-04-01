import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import FacilityCalls from "../../FacilityCalls";
import SuccessFailureAlert from "../../SuccessFailureAlerts";
import "./Facility.css";
import Booking from "./booking/booking";
function FacilityInfo(prop) {
  const [show, setShow] = useState(false);
  const isProvider = window.sessionStorage.getItem("isProvider") === "true";
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showErrorDeleteFacility, setShowErrorDeleteFacility] = useState(false);
  const [showSuccessDeleteFacility, setShowSuccessDeleteFacility] =
    useState(false);
  const [isManagedByUser, setIsManagedByUser] = useState(false);

  const navigate = useNavigate();

  const facilityDetails = {
    name: prop.facilityDetails.name,
    equipment: prop.facilityDetails.equipment,
    address: prop.facilityDetails.address,
    description: prop.facilityDetails.description,
    id: prop.facilityDetails.id,
  };

  useEffect(() => {
    const checkManagedFacilities = async () => {
      if (isProvider) {
        const facilityAPI = new FacilityCalls();
        const managedFacilities = await facilityAPI.getManagedFacilities();
        const isManaged = managedFacilities.some(
          (facility) => facility.id === prop.facilityDetails.id,
        );
        setIsManagedByUser(isManaged);
      }
    };

    checkManagedFacilities();
  }, [prop.facilityDetails.id, isProvider]);

  const getFacilityInfo = () => {
    const fetchAvailabilityData = async () => {
      try {
        const facilityId = facilityDetails.id;

        const url = `http://localhost:3001/api/availability/facility/${facilityId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch availability data");
        }

        await response.json();
        handleShow();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAvailabilityData();
  };

  const editFacility = () => {
    navigate(`/editFacility/${prop.facilityDetails.id}`);
  };
  const closeAlertDeleteFacility = () => {
    setShowErrorDeleteFacility(false);
    setShowSuccessDeleteFacility(false);
    prop.fetchData[1](!prop.fetchData[0]);
  };

  const handleDeleteFacility = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this facility? This action cannot be undone.",
      )
    ) {
      const facilityAPI = new FacilityCalls();
      facilityAPI
        .deleteFacility(parseInt(prop.facilityDetails.id))
        .then((resp) => {
          if (resp) {
            setShowSuccessDeleteFacility(true);
          } else {
            showErrorDeleteFacility(true);
          }
        });
    }
  };

  return (
    <>
      {isManagedByUser && (
        <div className="facilityInfo">
          <h1>{prop.facilityDetails.name}</h1>
          <p>
            <strong>Description:</strong> {prop.facilityDetails.description}
          </p>
          <p>
            <strong>Available Equipment:</strong>{" "}
            {prop.facilityDetails.equipment}
          </p>
          <p>
            <strong>Address:</strong> {prop.facilityDetails.address}
          </p>
          <div className="cost">
            {isProvider && (
              <Button onClick={editFacility}>Edit Facility</Button>
            )}
            <Button onClick={getFacilityInfo}>Schedule a Booking</Button>
            {isProvider && (
              <Button variant="danger" onClick={handleDeleteFacility}>
                Delete Facility
              </Button>
            )}
            <SuccessFailureAlert
              variant={"danger"}
              show={showErrorDeleteFacility}
              alertText={"Failed to Delete Facility!"}
              onClose={closeAlertDeleteFacility}
            />
            <SuccessFailureAlert
              variant={"success"}
              show={showSuccessDeleteFacility}
              alertText={"Deleted Facility!"}
              onClose={closeAlertDeleteFacility}
            />
          </div>
        </div>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="enlargeModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Create Booking for {prop.facilityDetails.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Booking facilityID={prop.facilityDetails.id} />
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
  fetchData: PropTypes.array,
};

export default FacilityInfo;
