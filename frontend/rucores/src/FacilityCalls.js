class FacilityCalls {
  /**
   *
   * @param {String} name
   * @param {String} description
   * @param {String} address
   * @param {Array<number>} providers
   * @param {number} balance
   * @param {String} equipment
   * @returns response containing object with provided fields, and ID of the facility
   */
  async createFacility(
    name,
    description,
    address,
    providers,
    balance,
    equipment,
  ) {
    try {
      const postData = {
        name: name,
        description: description,
        address: address,
        providers: providers,
        balance: balance,
        equipment: equipment,
      };

      const url = `http://localhost:3001/api/facility`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed To Create Facility");
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
   * @param {number} facilityID booking id To be deleted
   * @returns true or false depending if deleted successfully
   */
  async deleteBookingbybookingID(facilityID) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/facility/${facilityID}`,
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
   * @param {number} facilityID id of facility
   * @returns facility JSON object
   */
  async getFacilityByID(facilityID) {
    const apiUrl = `http://localhost:3001/api/facility/facilityID/${facilityID}`;

    try {
      const response = await fetch(apiUrl, {
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
   * @param {number} facilityID facilityID number
   * @param {String} name
   * @param {String} description
   * @param {String} address
   * @param {Array<number>} providers
   * @param {number} balance
   * @param {String} equipment
   *
   * returns the new object
   */
  async updateFacility(
    facilityID,
    name,
    description,
    address,
    providerArray,
    balance,
    equipment,
  ) {
    const apiUrl = `http://localhost:3001/api/facility/${facilityID}`;

    try {
      const updatedData = {
        name: name,
        description: description,
        address: address,
        providers: providerArray,
        balance: balance,
        equipment: equipment,
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
   * @param {number} facilityID
   * @returns true or false if deleted
   */
  async deleteFacility(facilityID) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/facility/${facilityID}`,
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
   * gets the current users facilities
   */
  async getFacilitiesByUser() {
    const apiUrl = `http://localhost:3001/api/facility/managed`;

    try {
      const response = await fetch(apiUrl, {
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
  async getManagedFacilities() {
    try {
      const url = `http://localhost:3001/api/facility/managed`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies or auth tokens are sent with the request
      });

      if (!response.ok) {
        throw new Error("Failed to fetch managed facilities");
      }

      const facilities = await response.json();
      return facilities;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

export default FacilityCalls;
