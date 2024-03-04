import React from 'react';
import './Facility.css';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/esm/Button';

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
      <p><strong>Description:</strong> {facilityDetails.description}</p>
      <p><strong>Available Equipment:</strong> {facilityDetails.equipment}</p>
      <p><strong>Operating Hours:</strong> {facilityDetails.operatingHours}</p>
      <p className="cost"><Button>Schedule a Booking</Button></p>
    </div>
  );
}
FacilityInfo.propTypes = {
  facilityDetails:PropTypes.object,
};
export default FacilityInfo;
