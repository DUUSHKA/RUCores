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
      // Handle the response data here
      console.log(data);
      return data;
    } catch (error) {
      // Handle errors here
      console.error("Fetch error:", error);
      throw error; // rethrow the error if needed
    }
  }
}

export default Availability;
