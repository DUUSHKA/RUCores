import "flatpickr/dist/themes/material_green.css"; // Import the Flatpickr styles
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FacilityInfo from "../schedule_facilities/FacilityCards/Facility";
import "./addFacility.css";
import FacilityCalls from "../FacilityCalls";
import SuccessFailureAlert from "../SuccessFailureAlerts";
import { useNavigate } from "react-router-dom";

function AddFacility() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [equipment, setEquipment] = useState("");
  const [cost, setCost] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const facilityData = {
  //     name: title,
  //     description: description,
  //     address: address,
  //     providers: [parseInt(window.sessionStorage.getItem("id"))],
  //     equipment: equipment,
  //     balance: 0,
  //   };
  //   console.log(facilityData);
  //   try {
  //     const facilityResponse =
  //       await FacilityApiService.createFacility(facilityData);
  //     console.log("Facility created successfully:", facilityResponse);
  //     console.log(facilityResponse.id);
  //     // const id = parseInt(facilityResponse.id);
  //     if (!facilityResponse.id) {
  //       throw new Error("Facility ID not returned from server.");
  //     }
  //     const availabilityData = {
  //       Date: startTime,
  //       startDateTime: startTime,
  //       endDateTime: endTime,
  //       user_id: parseInt(window.sessionStorage.getItem("id")),
  //       facility_id: facilityResponse.id,
  //       price: parseInt(cost),
  //     };
  //     const availabilityResponse =
  //       await FacilityApiService.createAvailability(availabilityData);
  //     console.log("Availability created successfully:", availabilityResponse);
  //   } catch (error) {
  //     console.error("Error during facility or availability creation:", error);
  //     alert(
  //       "There was an error creating the facility or availability. Please check your input and try again.",
  //     );
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && description && address && equipment) {
      const FacilityAPI = new FacilityCalls();
      FacilityAPI.createFacility(
        title,
        description,
        address,
        [parseInt(window.sessionStorage.getItem("id"))],
        0,
        equipment,
      ).then((resp) => {
        if (resp.id) {
          setShowSuccess(true);
          navigate(`/editFacility/${resp.id}`);
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

  return (
    <>
      <div className="addFacilitySeperator">
        <form>
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
              <div className="mb-3"></div>

              <InputGroup className="mb-3">
                <InputGroup.Text>Cost</InputGroup.Text>
                <Form.Control
                  placeholder="Cost"
                  aria-label="Cost"
                  value={cost}
                  onChange={(e) =>
                    setCost(e.target.value ? parseInt(e.target.value) : "")
                  }
                />
              </InputGroup>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Add Facility
            </button>
            <SuccessFailureAlert
              variant={"success"}
              show={showSuccess}
              alertText={"Successfully Created Facility!"}
              onClose={closeAlert}
            ></SuccessFailureAlert>
            <SuccessFailureAlert
              variant={"danger"}
              show={showError}
              alertText={"Failed to Create Facility!"}
              onClose={closeAlert}
            ></SuccessFailureAlert>
          </div>
        </form>
        <div>
          <h2>Preview:</h2>
          <FacilityInfo
            facilityDetails={{
              name: title,
              equipment: equipment,
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
