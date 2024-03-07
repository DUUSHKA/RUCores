import React, { useState } from "react";
import "./addFacility.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"; // Import the Flatpickr styles
import FacilityInfo from "../Facility";

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

  const facilityDetails = {
    name: title,
    equipment: equipment,
    operatingHours: formatTime(startTime) + " - " + formatTime(endTime),
    cost: cost,
    description: description,
  };
  return (
    <>
      <div className="addFacilitySeperator">
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
        </div>
        <div>
          <h2>Preview:</h2>

          <FacilityInfo facilityDetails={facilityDetails} />
        </div>
      </div>
    </>
  );
}

export default AddFacility;
