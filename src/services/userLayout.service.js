import axios from "axios";
import AuthService from "./auth.service";

const API_URL = "http://investlink-backend-1:5000/v1/";

const UserLayoutService = {
  async saveLayout(layout, estado) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.post(`${API_URL}user_layout`, { layout, estado }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error saving layout:", error);
      throw error;
    }
  },

  async getLayout(layout) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.get(`${API_URL}user_layout/${layout}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error getting layout:", error);
      throw error;
    }
  }
};

export default UserLayoutService;
