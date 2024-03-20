class User {
  /**
   * logs in a user, returns all relavent user info
   *
   * @param {string} userName
   * @param {string} password
   * @returns
   */
  async login(userName, password) {
    try {
      const postData = {
        username: userName,
        password: password,
      };

      const url = `http://localhost:3001/api/users/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to Login");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  /**
   * gets all users, given limit and offset
   *
   *
   * @param {Number} limit
   * @param {Number} offset
   */
  async getAllUsers(limit, offset) {
    const apiUrl = "http://localhost:3001/api/users/getAll";
    let urlWithParams = `${apiUrl}?limit=${limit}&offset=${offset}`;

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
      throw error;
    }
  }

  /**
   * gets current user info
   *
   */
  async getCurrentUser() {
    const apiUrl = "http://localhost:3001/api/users";
    let urlWithParams = `${apiUrl}`;

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
      throw error;
    }
  }

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

  /**
   * gets all providers
   */
  async getAllProviders() {
    const apiUrl = `http://localhost:3001/api/users/providers`;

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
   * creates user and returns user info
   *
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} userName
   * @param {string} email
   * @param {string} password
   * @param {Array<string>} roles
   * @param {boolean} isProvider
   */
  async createUser(
    firstName,
    lastName,
    userName,
    email,
    password,
    roles,
    isProvider,
  ) {
    try {
      const postData = {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        password: password,
        roles: roles,
        isProvider: isProvider,
      };

      const url = `http://localhost:3001/api/users`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
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
   * @returns gets user analytics for past 12 months
   */
  async getUserAnalytics() {
    const apiUrl = `http://localhost:3001/api/users/analytics`;
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
   * gets analytics for a provider based on facility ID
   *
   * @param {number} facilityID
   */
  async getProviderAnalytics(facilityID) {
    const apiUrl = `http://localhost:3001/api/users/providerAnalytics/${facilityID}`;
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
   * get all deleted
   *
   * @param {number} limit
   * @param {number} offset
   */
  async getAllWithDeleted(limit, offset) {
    const apiUrl = `http://localhost:3001/api/users/getAllWithDeleted?limit=${limit}&offset=${offset}`;
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
