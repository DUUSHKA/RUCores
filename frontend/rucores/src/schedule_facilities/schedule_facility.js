import React, { useEffect, useState } from "react";
import FacilityInfo from "./FacilityCards/Facility";
import "./schedule_facility.css";

function ScheduleFacility() {
  const [facilityData, setFacilityData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = 30;
        const offset = 0;

        const url = `http://localhost:3001/api/facility/?limit=${limit}&offset=${offset}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setFacilityData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [facilityData]);

  const facilityDetails = {
    name: "Lab A - Chemistry",
    equipment: ["Microscopes", "Bunsen Burners", "Chemical Reactors"],
    operatingHours: "9 AM - 5 PM",
    cost: "50 RU Coins per hour",
    description:
      "Lab A specializes in chemistry research and offers a wide range of equipment for various experiments.",
  };

  return (
    <>
      <div className="scheduleFacilityView">
        {facilityData && facilityData.length > 0 ? (
          facilityData.map((item, index) => (
            <FacilityInfo key={index} facilityDetails={item} />
          ))
        ) : (
          <p>Loading...</p>
        )}
        <FacilityInfo facilityDetails={facilityDetails} />
        <FacilityInfo facilityDetails={facilityDetails} />
        <FacilityInfo facilityDetails={facilityDetails} />
        <FacilityInfo facilityDetails={facilityDetails} />
      </div>
    </>
  );
}

export default ScheduleFacility;
