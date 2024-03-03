import PropTypes from "prop-types";
import React from "react";
import "./Facility.css";

function FacilityInfo(prop) {
  const facilityDetails = {
    name: prop.facilityDetails.name,
    equipment: prop.facilityDetails.equipment,
    operatingHours: prop.facilityDetails.operatingHours,
    cost: prop.facilityDetails.cost,
    description: prop.facilityDetails.description,
  };

  return (
    <div className="facilityInfo">
      <h1>{facilityDetails.name}</h1>
      <p>
        <strong>Description:</strong> {facilityDetails.description}
      </p>
      <p>
        <strong>Available Equipment:</strong> {facilityDetails.equipment}
      </p>
      <p>
        <strong>Operating Hours:</strong> {facilityDetails.operatingHours}
      </p>
      <p className="cost">
        <strong>Cost:</strong> {facilityDetails.cost}
      </p>
    </div>
  );
}
FacilityInfo.propTypes = {
  facilityDetails: PropTypes.object,
};
export default FacilityInfo;
