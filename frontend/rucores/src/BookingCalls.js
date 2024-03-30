// eslint-disable-next-line no-unused-vars
class BookingCalls {
  /**
   * gets bookings by user (A USER CANNOT HAVE MORE THAN 30 BOOKINGS)
   *
   * takes in a limit, and offset (both integers)
   * limit is number of bookings you want to get (first booking is oldest)
   * offset is the number of bookings you want to increment away by
   *
   * ex: if you offset 10, and get 10, you will get the bookings at index 9-19
   */
  async getBookingsByUser(limit, offset, order, orderBy, firstName) {
    const apiUrl = "http://localhost:3001/api/booking/scheduled";
    let urlWithParams = `${apiUrl}?limit=${limit}&offset=${offset}`;

    if (order) {
      urlWithParams += `&order=${order}`;
    }
    if (orderBy) {
      urlWithParams += `&orderBy=${orderBy}`;
    }
    if (firstName) {
      urlWithParams += `&firstName=${firstName}`;
    }
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
      throw error; // rethrow the error if needed
    }
  }

  /**
   *
   * @param {*} bookingId booking id To be deleted
   * @returns true or false depending if deleted successfully
   */
  async deleteBookingbybookingID(bookingId) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/booking/${bookingId}`,
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
   * @param userID
   *
   * returns a list of bookings for a user
   */
  async getAllFutureBookingsByUser(userID) {
    const apiUrl = `http://localhost:3001/api/booking/futureUser/${userID}`;
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
      throw error; // rethrow the error if needed
    }
  }

  /**
   * @param facilityID
   *
   * returns a list of bookings for a facility
   */
  async getAllFutureBookingsByFacility(facilityID) {
    const apiUrl = `http://localhost:3001/api/booking/futureFacility/${facilityID}`;
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
      throw error; // rethrow the error if needed
    }
  }

  /**
   * @param facilityID
   *
   * returns a list of bookings for a facility
   */
  async getAllPastBookingsByFacility(facilityID) {
    const apiUrl = `http://localhost:3001/api/booking/pastFacility/${facilityID}`;
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
      throw error; // rethrow the error if needed
    }
  }
}

export default BookingCalls;
