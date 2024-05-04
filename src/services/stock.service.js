import axios from "axios";

import AuthService from "./auth.service";

const API_URL = "http://localhost:5000/";

const StockService = {
  async getAllStocks() {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }
  
    try {
      let response = await axios.get(`${API_URL}stocks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      let favoritas = response.data.filter(item => item.favorita);
      let naoFavoritas = response.data.filter(item => !item.favorita);
  
      favoritas.sort((a, b) => a.ticker.localeCompare(b.ticker));
      
      naoFavoritas.sort((a, b) => a.ticker.localeCompare(b.ticker));
  
      let orderedList = favoritas.concat(naoFavoritas);
  
      return orderedList;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      throw error;
    }
  }, 

  async addFavorite(stockId) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.post(`${API_URL}favorites/${stockId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  async removeFavorite(stockId) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.delete(`${API_URL}favorites/${stockId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }
};

export default StockService;
