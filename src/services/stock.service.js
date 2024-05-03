import axios from "axios";

import AuthService from "./auth.service";

const API_URL = "http://localhost:5000/stocks";

const StockService = {
    async getAllStocks() {
        const token = AuthService.getToken();
        if (!token) {
          throw new Error("Token not found");
        }
    
        try {
          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching stocks:", error);
          throw error;
        }
      },

  async adicionarFavorita(ticker) {
    try {
      const response = await axios.post(`${API_URL}${ticker}/favorita`);
      return response.data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  async removerFavorita(ticker) {
    try {
      const response = await axios.delete(`${API_URL}${ticker}/favorita`);
      return response.data;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }
};

export default StockService;
