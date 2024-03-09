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
  getFacility: () => {
    return fetch(`http://localhost:3001/api/facility/`, {
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
  deleteFacility: (facilityId) => {
    return fetch(`http://localhost:3001/api/facility/${facilityId}`, {
      method: "DELETE",
      credentials: "include",
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
  getAvailability: () => {
    return fetch(`http://localhost:3001/api/availability/`, {
      method: "GET",
      credentials: "include",
    }).then((response) => responseHandler(response));
  },

  updateAvailabilty: (facilityId, facilityData) => {
    return fetch(`http://localhost:3001/api/availability/${facilityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facilityData),
    }).then((response) => responseHandler(response));
  },
  deleteAvailability: (availabilityId) => {
    return fetch(`http://localhost:3001/api/availability/${availabilityId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => responseHandler(response));
  },
};

const responseHandler = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

function EditFacility() {
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
  const handleDeleteFacility = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this facility? This action cannot be undone.",
      )
    ) {
      FacilityApiService.deleteFacility(facilityId)
        .then(() => {
          alert("Facility deleted successfully.");
        })
        .catch((error) => console.error("Error deleting facility:", error));
    }
  };

  const handleDeleteAvailability = (availabilityId) => {
    if (window.confirm("Are you sure you want to delete this availability?")) {
      AvailabilityApiService.deleteAvailability(availabilityId)
        .then(() => {
          alert("Availability deleted successfully");
        })
        .catch((error) => console.error("Error deleting availability:", error));
    }
  };
  return (
    <div className="edit-facility-page">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        </Form>

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
              onChange={(newValue) =>
                setNewAvailability({
                  ...newAvailability,
                  startDateTime: newValue,
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
              onChange={(newValue) =>
                setNewAvailability({
                  ...newAvailability,
                  endDateTime: newValue,
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
        </Form>

        {/* Delete facility button */}
        <Button
          variant="danger"
          className="mt-3"
          onClick={handleDeleteFacility}
        >
          Delete Facility
        </Button>

        {/* List current availabilities */}
        <h3>Current Availabilities</h3>
        {facility.availabilities && facility.availabilities.length > 0 ? (
          facility.availabilities.map((availability) => (
            <div key={availability.id} className="availability-item">
              <p>
                Date: {availability.Date.format("YYYY-MM-DD")} - Start:{" "}
                {availability.startDateTime.format("HH:mm")} - End:{" "}
                {availability.endDateTime.format("HH:mm")} - Price: $
                {availability.price}
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
      </LocalizationProvider>
    </div>
  );
}

export default EditFacility;
