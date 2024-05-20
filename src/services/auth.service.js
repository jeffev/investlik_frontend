import axios from "axios";

const API_URL = "http://investlink-backend-1:5000/";

class AuthService {
  async login(user_name, password) {
    try {
      const response = await axios.post(API_URL + "user/login", { user_name, password });
      if (response.status === 200) {
        const user = response.data;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      return response;
    } catch (error) {
      return error.response;
    }
  }

  logout() {
    sessionStorage.removeItem("user");
  }

  async register(userData) {
    try {
      const response = await axios.post(API_URL + "users", userData);
      if (response.status === 201) {
        const user = response.data;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      return response;
    } catch (error) {
      return error.response;
    }
  }

  getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.name : null;
  }

  getCurrentUsername() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.username : null;
  }

  getToken() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.access_token : null;
  }

  isAuthenticated() {
    return sessionStorage.getItem("user") ? true : false;
  }
}

export default new AuthService();
