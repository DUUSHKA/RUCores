import "flatpickr/dist/themes/material_green.css"; // Import the Flatpickr styles
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Flatpickr from "react-flatpickr";
import FacilityInfo from "../schedule_facilities/FacilityCards/Facility";
import "./addFacility.css";

const FacilityApiService = {
  createFacility: (facilityData) => {
    return fetch("http://localhost:3001/api/facility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facilityData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },
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
};

function AddFacility() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [equipment, setEquipment] = useState("");
  const [cost, setCost] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();

    const facilityData = {
      name: title,
      description: description,
      address: address,
      providers: [parseInt(window.sessionStorage.getItem("id"))],
      equipment: equipment,
      balance: 0,
    };

    try {
      const facilityResponse =
        await FacilityApiService.createFacility(facilityData);
      console.log("Facility created successfully:", facilityResponse);
      console.log(facilityResponse.id);
      // const id = parseInt(facilityResponse.id);
      if (!facilityResponse.id) {
        throw new Error("Facility ID not returned from server.");
      }
      const availabilityData = {
        Date: startTime,
        startDateTime: startTime,
        endDateTime: endTime,
        user_id: parseInt(window.sessionStorage.getItem("id")),
        facility_id: 1,
        price: parseInt(cost),
      };
      const availabilityResponse =
        await FacilityApiService.createAvailability(availabilityData);
      console.log("Availability created successfully:", availabilityResponse);
    } catch (error) {
      console.error("Error during facility or availability creation:", error);
      alert(
        "There was an error creating the facility or availability. Please check your input and try again.",
      );
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="addFacilitySeperator">
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Enter Info:</h2>
            <div className="facilityInfo">
              <InputGroup className="mb-3">
                <InputGroup.Text>Title</InputGroup.Text>
                <Form.Control
                  placeholder="Facility Title"
                  aria-label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Description</InputGroup.Text>
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  aria-label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Available Equipment</InputGroup.Text>
                <Form.Control
                  placeholder="Available Equipment"
                  aria-label="Available Equipment"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                />
                <InputGroup className="mb-3">
                  <InputGroup.Text>Address</InputGroup.Text>
                  <Form.Control
                    placeholder="Address"
                    aria-label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </InputGroup>
              </InputGroup>
              <div className="mb-3">
                <strong>Operating Hours:</strong>
                <div className="d-flex align-items-center">
                  <Flatpickr
                    className="form-control"
                    data-enable-time
                    value={startTime}
                    onChange={([selectedDate]) => {
                      setStartTime(selectedDate);
                    }}
                    options={{
                      noCalendar: true,
                      dateFormat: "H:i",
                      time_24hr: true,
                    }}
                  />

                  <span className="mx-2">to</span>
                  <Flatpickr
                    className="form-control"
                    data-enable-time
                    value={endTime}
                    onChange={([selectedDate]) => {
                      setEndTime(selectedDate);
                    }}
                    options={{
                      noCalendar: true,
                      dateFormat: "H:i",
                      time_24hr: true,
                    }}
                  />
                </div>
              </div>
              <InputGroup className="mb-3">
                <InputGroup.Text>Cost</InputGroup.Text>
                <Form.Control
                  placeholder="Cost"
                  aria-label="Cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </InputGroup>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Facility
            </button>
          </div>
        </form>
        <div>
          <h2>Preview:</h2>
          <FacilityInfo
            facilityDetails={{
              name: title,
              equipment: equipment,
              operatingHours:
                formatTime(startTime) + " - " + formatTime(endTime),
              cost: cost,
              address: address,
              description: description,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default AddFacility;
