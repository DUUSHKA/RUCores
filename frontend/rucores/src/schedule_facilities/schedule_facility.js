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

        const url = `http://localhost:3001/api/facility/getAll?limit=${limit}&offset=${offset}`;

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
        console.log(data);
        setFacilityData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [facilityData]);

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
      </div>
    </>
  );
}

export default ScheduleFacility;
