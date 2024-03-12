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
      console.log(data);
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
}

export default BookingCalls;
