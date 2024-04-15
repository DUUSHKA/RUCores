class Transaction {
  /**
   * gets all transactions
   *
   * orderBy=date
   * order = ASC or DESC
   */
  async getAllTransactions(limit, offset, orderBy, order) {
    const apiUrl = "http://localhost:3001/api/transactions/getAll";
    let urlWithParams = `${apiUrl}?limit=${limit}&offset=${offset}`;
    if (orderBy) {
      urlWithParams += `&orderBy=${orderBy}`;
    }
    if (order) {
      urlWithParams += `&order=${order}`;
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
      throw error;
    }
  }

  /**
   *
   * @param {number} facilityID
   * @param {number} limit
   * @param {number} offset
   * @param {string} orderBy
   * @param {string} order
   * @returns a list of previous
   */
  async getTransactionsByFacilityId(facilityID, limit, offset, orderBy, order) {
    const apiUrl = `http://localhost:3001/api/transactions/facilityID/${facilityID}`;
    let urlWithParams = `${apiUrl}?limit=${limit}&offset=${offset}`;
    if (orderBy) {
      urlWithParams += `&orderBy=${orderBy}`;
    }
    if (order) {
      urlWithParams += `&order=${order}`;
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
      throw error;
    }
  }
}

export default Transaction;
