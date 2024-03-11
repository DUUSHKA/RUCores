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
import { useParams } from "react-router-dom";
import "./editFacility.css";

const FacilityApiService = {
  getFacility: (facilityId) => {
    return fetch(`http://localhost:3001/api/facility/${facilityId}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => responseHandler(response));
  },

  updateFacility: (facilityId, facilityData) => {
    return fetch(`http://localhost:3001/api/facility/${facilityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facilityData),
    }).then((response) => responseHandler(response));
  },
};

export const AvailabilityApiService = {
  createAvailability: (availabilityData) => {
    return fetch("http://localhost:3001/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(availabilityData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },
  getFacility: (facilityId) => {
    return fetch(`http://localhost:3001/api/availability/${facilityId}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => responseHandler(response));
  },

  updateFacility: (facilityId, facilityData) => {
    return fetch(`http://localhost:3001/api/availability/${facilityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facilityData),
    }).then((response) => responseHandler(response));
  },
};

const responseHandler = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

function editFacility() {
  const { facilityId } = useParams();
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
    startDateTime: dayjs(),
    endDateTime: dayjs(),
    price: 0,
    facility_id: facilityId,
  });

  useEffect(() => {
    FacilityApiService.getFacility(facilityId)
      .then((data) => setFacility(data))
      .catch((error) =>
        console.error("Failed to fetch facility details", error),
      );
  }, [facilityId]);

  const handleInputChange = (e, objectSetter) => {
    const { name, value } = e.target;
    objectSetter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFacilityUpdate = (e) => {
    e.preventDefault();
    FacilityApiService.updateFacility(facilityId, facility)
      .then(() => alert("Facility updated successfully"))
      .catch((error) => console.error("Error updating facility:", error));
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();
    AvailabilityApiService.createAvailability(newAvailability)
      .then(() => alert("Availability added successfully"))
      .catch((error) => console.error("Error adding availability:", error));
  };

  return (
    <div className="edit-facility-page">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <h1>Edit Facility</h1>
        <Form onSubmit={handleFacilityUpdate}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Name</InputGroup.Text>
            <Form.Control
              type="text"
              name="name"
              value={facility.name}
              onChange={(e) => handleInputChange(e, setFacility)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              as="textarea"
              name="description"
              value={facility.description}
              onChange={(e) => handleInputChange(e, setFacility)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Address</InputGroup.Text>
            <Form.Control
              type="text"
              name="address"
              value={facility.address}
              onChange={(e) => handleInputChange(e, setFacility)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Equipment</InputGroup.Text>
            <Form.Control
              type="text"
              name="equipment"
              value={facility.equipment}
              onChange={(e) => handleInputChange(e, setFacility)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Balance</InputGroup.Text>
            <Form.Control
              type="number"
              name="balance"
              value={facility.balance}
              onChange={(e) => handleInputChange(e, setFacility)}
            />
          </InputGroup>
          <Button variant="primary" type="submit">
            Update Facility
          </Button>
        </Form>

        <h2>Add New Availability</h2>
        <Form onSubmit={handleAddAvailability}>
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
          <InputGroup className="mb-3">
            <InputGroup.Text>Start Time</InputGroup.Text>
            <TimePicker
              value={newAvailability.startDateTime}
              onChange={(newValue) =>
                setNewAvailability({
                  ...newAvailability,
                  startDateTime: newValue,
                })
              }
              renderInput={(params) => <Form.Control {...params} />}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>End Time</InputGroup.Text>
            <TimePicker
              value={newAvailability.endDateTime}
              onChange={(newValue) =>
                setNewAvailability({
                  ...newAvailability,
                  endDateTime: newValue,
                })
              }
              renderInput={(params) => <Form.Control {...params} />}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Price</InputGroup.Text>
            <Form.Control
              type="number"
              name="price"
              value={newAvailability.price}
              onChange={(e) => handleInputChange(e, setNewAvailability)}
            />
          </InputGroup>
          <Button variant="success" type="submit">
            Add Availability
          </Button>
        </Form>
      </LocalizationProvider>
    </div>
  );
}

export default editFacility;
