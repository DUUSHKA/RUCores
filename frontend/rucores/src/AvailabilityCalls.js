class Availability {
  /**
   *
   * takes in the availability id
   * gives back availability structure
   *
   */
  async getAvailByID(availID) {
    const apiUrl = "http://localhost:3001/api/availability/availabilityID/";
    const urlWithParams = `${apiUrl}${availID}`;

    try {
      const response = await fetch(urlWithParams, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  /**
   *
   * @param {date string} dateOfCreation
   * @param {date string} startDateTime
   * @param {date string} endDateTime
   * @param {number} userID
   * @param {number} FacilityID
   * @param {number} pricePerBlock
   * @returns
   */
  async createAvail(
    dateOfCreation,
    startDateTime,
    endDateTime,
    userID,
    FacilityID,
    pricePerBlock,
  ) {
    try {
      const postData = {
        Date: dateOfCreation,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        user_id: userID,
        facility_id: FacilityID,
        price: pricePerBlock,
      };

      const url = `http://localhost:3001/api/availability`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        return "ERROR";
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  /**
   *
   * @param {number} availID
   * @param {date string} currentDate
   * @param {date string} startDateTime
   * @param {date string} endDateTime
   * @param {number} userID
   * @param {number} FacilityID
   * @param {number} pricePerBlock
   * @returns updated avail obj
   */
  async updateAvailabilty(
    availID,
    currentDate,
    startDateTime,
    endDateTime,
    userID,
    FacilityID,
    pricePerBlock,
  ) {
    const apiUrl = `http://localhost:3001/api/availability/${availID}`;

    try {
      const updatedData = {
        Date: currentDate,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        user_id: userID,
        facility_id: FacilityID,
        price: pricePerBlock,
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  /**
   *
   * @param {number} availID
   * @returns true or false if deleted or not
   */
  async deleteAvail(availID) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/availability/${availID}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {number} facilityID
   * @returns list of avails for facility
   */
  async getAvailByFacilityID(facilityID) {
    const apiUrl = "http://localhost:3001/api/availability/facility/";
    const urlWithParams = `${apiUrl}${facilityID}`;

    try {
      const response = await fetch(urlWithParams, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
}

export default Availability;
