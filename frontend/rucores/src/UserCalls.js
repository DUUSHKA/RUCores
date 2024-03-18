class User {
  /**
   * @param {string} userId - The user ID
   * @param {number} numOfRuCoins - The number of RU COINS to add
   * @throws {Error} Throws an error if the request fails
   */
  async addFundsToCurrUser(userId, numOfRuCoins) {
    try {
      const postData = {
        refill: numOfRuCoins,
      };

      const url = `http://localhost:3001/api/users/refillBalance/${userId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to refill balance");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  /**
   * gets user Info based on ID
   * userID must be an int
   */
  async getUserByID(userID) {
    const apiUrl = `http://localhost:3001/api/users/userID/${userID}`;

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
}

export default User;
