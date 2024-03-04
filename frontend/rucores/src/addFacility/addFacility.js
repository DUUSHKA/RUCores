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
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  },
};

function AddFacility() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [equipment, setEquipment] = useState("");
  const [cost, setCost] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const facilityData = {
      name: title,
      description,
      equipment,
      balance: parseFloat(cost),
    };

    try {
      const response = await FacilityApiService.createFacility(facilityData);
      console.log("Facility created successfully:", response);
    } catch (error) {
      console.error("Failed to create facility:", error);
    }
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
              description: description,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default AddFacility;
