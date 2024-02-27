import React, { useState } from 'react';
import './addFacility.css';
import FacilityInfo from '../Facility';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"; // Import the Flatpickr styles

function AddFacility() {
    const [date, setDate] = useState(new Date());

    return (
        <>
            <div className="facilityInfo">
                <h1>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                        <Form.Control
                            placeholder="Facility Title"
                            aria-label="Title"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </h1>
                <p>
                    <strong>Description:</strong>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Description</InputGroup.Text>
                        <Form.Control
                            placeholder="Description"
                            aria-label="Description"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </p>
                <p>
                    <strong>Available Equipment:</strong>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Available Equipment</InputGroup.Text>
                        <Form.Control
                            placeholder="Available Equipment"
                            aria-label="Available Equipment"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </p>
                <p>
                    <strong>Operating Hours:</strong>
                    <Flatpickr
                        data-enable-time
                        value={date}
                        onChange={(selectedDates) => {
                            setDate(selectedDates[0]);
                        }}
                    />
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Available From</InputGroup.Text>
                        <Form.Control
                            placeholder="Enter Time With A.M or P.M"
                            aria-label="Enter Time With A.M or P.M"
                            aria-describedby="basic-addon1"
                        />
                        <InputGroup.Text id="basic-addon1">Available To</InputGroup.Text>
                        <Form.Control
                            placeholder="Enter Time With A.M or P.M"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </p>
                <p className="cost">
                    <strong>Cost:</strong>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                        <Form.Control
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </p>
            </div>
            <h2 className=''>Example :</h2>
            <FacilityInfo />
        </>
    );
}

export default AddFacility;
