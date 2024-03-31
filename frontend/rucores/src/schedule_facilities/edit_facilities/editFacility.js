/* eslint-disable no-unused-vars */
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate, useParams } from "react-router-dom";
import Availability from "../../AvailabilityCalls";
import FacilityCalls from "../../FacilityCalls";
import SuccessFailureAlert from "../../SuccessFailureAlerts";
import "./editFacility.css";

function EditFacility() {
  const { facilityID } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState({
    name: "",
    description: "",
    address: "",
    equipment: "",
    balance: 0,
    providers: [],
  });
  const [newAvailability, setNewAvailability] = useState({
    Date: dayjs(),
    startDateTime: "",
    endDateTime: "",
    price: 0,
    facility_id: facilityID,
  });

  const [availabilities, setAvailabilities] = useState();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [showSuccessAvail, setShowSuccessAvail] = useState(false);
  const [showErrorAvail, setShowErrorAvail] = useState(false);

  const [showSuccessDelAvail, setShowSuccessDelAvail] = useState(false);
  const [showErrorDelAvail, setShowErrorDelAvail] = useState(false);

  const [showErrorDeleteFacility, setShowErrorDeleteFacility] = useState(false);

  const closeAlertAvail = () => {
    setShowSuccessAvail(false);
    setShowErrorAvail(false);
  };

  const closeDelAvail = () => {
    setShowErrorDelAvail(false);
    setShowSuccessDelAvail(false);
  };

  useEffect(() => {
    const facilityService = new FacilityCalls();

    facilityService.getFacilityByID(facilityID).then((resp) => {
      if (resp.name) {
        setFacility(resp);
      }
    });
  }, [facilityID]);

  const handleInputChange = (e, objectSetter) => {
    const { name, value } = e.target;
    objectSetter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFacilityUpdate = (e) => {
    e.preventDefault();
    if (
      facility.name &&
      facility.description &&
      facility.address &&
      facility.equipment
    ) {
      const facilityAPI = new FacilityCalls();
      facilityAPI
        .updateFacility(
          facilityID,
          facility.name,
          facility.description,
          facility.address,
          facility.providers,
          facility.balance,
          facility.equipment,
        )
        .then((resp) => {
          if (resp.name) {
            setShowSuccess(true);
          } else {
            setShowError(true);
          }
        });
    } else {
      setShowError(true);
    }
  };

  const closeAlert = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  const closeAlertDeleteFacility = () => {
    setShowErrorDeleteFacility(false);
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();
    const availAPI = new Availability();
    const currentDate = new Date();

    const selectedDate = new Date(newAvailability.Date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    currentDate.setFullYear(year);
    currentDate.setMonth(month - 1);
    currentDate.setDate(day);
    const isoString = currentDate.toISOString();

    const startDateTime = new Date(newAvailability.startDateTime);
    startDateTime.setFullYear(year);
    startDateTime.setMonth(month - 1);
    startDateTime.setDate(day);

    const endDateTime = new Date(newAvailability.endDateTime);
    endDateTime.setFullYear(year);
    endDateTime.setMonth(month - 1);
    endDateTime.setDate(day);

    availAPI
      .createAvail(
        isoString,
        startDateTime.toISOString(),
        endDateTime.toISOString(),
        parseInt(window.sessionStorage.getItem("id")),
        parseInt(facilityID),
        parseInt(newAvailability.price),
      )
      .then((resp) => {
        if (resp.id) {
          setShowSuccessAvail(true);
        } else {
          setShowErrorAvail(true);
        }
      });
  };
  const handleDeleteFacility = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this facility? This action cannot be undone.",
      )
    ) {
      const facilityAPI = new FacilityCalls();
      facilityAPI.deleteFacility(parseInt(facilityID)).then((resp) => {
        if (resp) {
          navigate(`/AddFacility`);
        } else {
          showErrorDeleteFacility(true);
        }
      });
    }
  };

  const handleDeleteAvailability = (availabilityId) => {
    if (window.confirm("Are you sure you want to delete this availability?")) {
      const availAPI = new Availability();
      if (availabilityId) {
        availAPI.deleteAvail(availabilityId).then(() => {
          setShowSuccessDelAvail(true);
        });
      } else {
        setShowErrorDelAvail(true);
      }
    }
  };

  useEffect(() => {
    const AvailAPI = new Availability();
    AvailAPI.getAvailByFacilityID(parseInt(facilityID)).then((resp) => {
      setAvailabilities(resp);
    });
  }, [
    showSuccessAvail,
    showErrorAvail,
    showErrorDelAvail,
    showSuccessDelAvail,
  ]);

  const formatTime = (timeString) => {
    const formattedTime = new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
    return formattedTime;
  };

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/New_York",
    });
    return formattedDate;
  };

  return (
    <div className="edit-facility-page">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="EDITLEFTSIDE">
          <h1>Edit Facility</h1>
          <Form onSubmit={handleFacilityUpdate}>
            {/* Facility name input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Name</InputGroup.Text>
              <Form.Control
                type="text"
                name="name"
                value={facility.name}
                onChange={(e) => handleInputChange(e, setFacility)}
              />
            </InputGroup>

            {/* Facility description input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Description</InputGroup.Text>
              <Form.Control
                as="textarea"
                name="description"
                value={facility.description}
                onChange={(e) => handleInputChange(e, setFacility)}
              />
            </InputGroup>

            {/* Facility address input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Address</InputGroup.Text>
              <Form.Control
                type="text"
                name="address"
                value={facility.address}
                onChange={(e) => handleInputChange(e, setFacility)}
              />
            </InputGroup>

            {/* Facility equipment input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Equipment</InputGroup.Text>
              <Form.Control
                type="text"
                name="equipment"
                value={facility.equipment}
                onChange={(e) => handleInputChange(e, setFacility)}
              />
            </InputGroup>

            {/* Facility balance input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Balance</InputGroup.Text>
              <Form.Control
                type="number"
                name="balance"
                value={facility.balance}
                onChange={(e) => handleInputChange(e, setFacility)}
              />
            </InputGroup>

            {/* Update facility button */}

            <Button variant="primary" type="submit">
              Update Facility
            </Button>
            {/* Delete facility button */}
            <Button
              variant="danger"
              className=""
              onClick={handleDeleteFacility}
            >
              Delete Facility
            </Button>

            <SuccessFailureAlert
              variant={"success"}
              show={showSuccess}
              alertText={"Successfully Updated Facility!"}
              onClose={closeAlert}
            ></SuccessFailureAlert>
            <SuccessFailureAlert
              variant={"danger"}
              show={showError}
              alertText={"Failed to Update Facility!"}
              onClose={closeAlert}
            ></SuccessFailureAlert>
            <SuccessFailureAlert
              variant={"danger"}
              show={showErrorDeleteFacility}
              alertText={"Failed to Delete Facility!"}
              onClose={closeAlertDeleteFacility}
            ></SuccessFailureAlert>
          </Form>
        </div>
        <div className="EDITMIDDLE">
          <h2>Add New Availability</h2>
          <Form onSubmit={handleAddAvailability}>
            {/* New availability date picker */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Date</InputGroup.Text>
              <DatePicker
                value={newAvailability.Date}
                onChange={(newValue) =>
                  setNewAvailability({ ...newAvailability, Date: newValue })
                }
                renderInput={(params) => <Form.Control {...params} />}
              />
            </InputGroup>

            {/* New availability start time picker */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Start Time</InputGroup.Text>
              <TimePicker
                value={newAvailability.startDateTime}
                minutesStep={30}
                onChange={(newValue) =>
                  setNewAvailability({
                    ...newAvailability,
                    startDateTime: newValue.toISOString(),
                  })
                }
                renderInput={(params) => <Form.Control {...params} />}
              />
            </InputGroup>

            {/* New availability end time picker */}
            <InputGroup className="mb-3">
              <InputGroup.Text>End Time</InputGroup.Text>
              <TimePicker
                value={newAvailability.endDateTime}
                minutesStep={30}
                onChange={(newValue) =>
                  setNewAvailability({
                    ...newAvailability,
                    endDateTime: newValue.toISOString(),
                  })
                }
                renderInput={(params) => <Form.Control {...params} />}
              />
            </InputGroup>

            {/* New availability price input */}
            <InputGroup className="mb-3">
              <InputGroup.Text>Price</InputGroup.Text>
              <Form.Control
                type="number"
                name="price"
                value={newAvailability.price}
                onChange={(e) => handleInputChange(e, setNewAvailability)}
              />
            </InputGroup>

            {/* Add new availability button */}
            <Button variant="success" type="submit">
              Add Availability
            </Button>
            <SuccessFailureAlert
              variant={"success"}
              show={showSuccessAvail}
              alertText={"Successfully Added Availability!"}
              onClose={closeAlertAvail}
            ></SuccessFailureAlert>
            <SuccessFailureAlert
              variant={"danger"}
              show={showErrorAvail}
              alertText={"Failed to Add Availability!"}
              onClose={closeAlertAvail}
            ></SuccessFailureAlert>
          </Form>
        </div>
        <div className="editRight">
          {/* List current availabilities */}
          <h3>Current Availabilities</h3>
          {availabilities && availabilities.length > 0 ? (
            availabilities.map((availability, index) => (
              <div key={index} className="availability-item">
                <p>
                  Date: {formatDate(availability.startTime)} - Start:{" "}
                  {formatTime(availability.startTime)} - End:{" "}
                  {formatTime(availability.endTime)} - Price:
                  {" " + availability.price} RU coins/block
                </p>
                <Button
                  variant="warning"
                  onClick={() => handleDeleteAvailability(availability.id)}
                >
                  Delete Availability
                </Button>
              </div>
            ))
          ) : (
            <p>No availabilities found.</p>
          )}
          <SuccessFailureAlert
            variant={"danger"}
            show={showSuccessDelAvail}
            alertText={"Failed to Add Availability!"}
            onClose={closeDelAvail}
          ></SuccessFailureAlert>
          <SuccessFailureAlert
            variant={"success"}
            show={showErrorDelAvail}
            alertText={"Successfully Added Availability!"}
            onClose={closeDelAvail}
          ></SuccessFailureAlert>
        </div>
      </LocalizationProvider>
    </div>
  );
}

export default EditFacility;
