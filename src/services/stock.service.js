import axios from "axios";

import AuthService from "./auth.service";

const API_URL = "http://investlink-backend-1:5000/";

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

  async removeFavorite(stock_ticker) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.delete(`${API_URL}favorites/${stock_ticker}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  },

  async getFavorites() {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.get(`${API_URL}favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  async editFavorite(favoriteId, newData) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }
  
    try {
      const response = await axios.put(`${API_URL}favorite/${favoriteId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error editing favorite:", error);
      throw error;
    }
  },
  
  async updateStocks() {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Token not found");
    }
  
    try {
      const response = await axios.put(`${API_URL}stocks/update-stocks`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating stocks:", error);
      throw error;
    }
  }

};

export default StockService;
