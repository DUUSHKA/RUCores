import React from 'react';
import './Facility.css'; 

function FacilityInfo() {
  const facilityDetails = {
    name: "Lab A - Chemistry",
    equipment: ["Microscopes", "Bunsen Burners", "Chemical Reactors"],
    operatingHours: "9 AM - 5 PM",
    cost: "50 RU Coins per hour",
    description: "Lab A specializes in chemistry research and offers a wide range of equipment for various experiments.",
  };

  return (
    <div className="facilityInfo">
      <h1>{facilityDetails.name}</h1>
      <p><strong>Description:</strong> {facilityDetails.description}</p>
      <p><strong>Available Equipment:</strong> {facilityDetails.equipment.join(', ')}</p>
      <p><strong>Operating Hours:</strong> {facilityDetails.operatingHours}</p>
      <p><strong>Cost:</strong> {facilityDetails.cost}</p>
      {}
    </div>
  );
}

export default FacilityInfo;
