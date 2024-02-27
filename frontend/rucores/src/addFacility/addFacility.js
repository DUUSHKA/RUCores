import React, { useState } from "react";
import "./addFacility.css";
import FacilityInfo from "../Facility";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"; // Import the Flatpickr styles

function AddFacility() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  return (
    <>
      <div className="facilityInfo">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
          <Form.Control
            placeholder="Facility Title"
            aria-label="Title"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Description</InputGroup.Text>
          <Form.Control
            as="textarea"
            placeholder="Description"
            aria-label="Description"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Available Equipment</InputGroup.Text>
          <Form.Control
            placeholder="Available Equipment"
            aria-label="Available Equipment"
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
          <Form.Control placeholder="Cost" aria-label="Cost" />
        </InputGroup>
      </div>
      <h2>Example:</h2>
      <FacilityInfo />
    </>
  );
}

export default AddFacility;
