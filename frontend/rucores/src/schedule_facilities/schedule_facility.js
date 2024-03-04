import React from 'react';
import './schedule_facility.css';
import FacilityInfo from './FacilityCards/Facility';

function ScheduleFacility() {

    const facilityDetails = {
        name: "Lab A - Chemistry",
        equipment: ["Microscopes", "Bunsen Burners", "Chemical Reactors"],
        operatingHours: "9 AM - 5 PM",
        cost: "50 RU Coins per hour",
        description: "Lab A specializes in chemistry research and offers a wide range of equipment for various experiments.",
      };

    return (
        <>
        <div className="scheduleFacilityView">
            <FacilityInfo facilityDetails={facilityDetails}/>
            <FacilityInfo facilityDetails={facilityDetails}/>
            <FacilityInfo facilityDetails={facilityDetails}/>
            <FacilityInfo facilityDetails={facilityDetails}/>



        </div>
        
        
        
        </>
    );
}

export default ScheduleFacility;
