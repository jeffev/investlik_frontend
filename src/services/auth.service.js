import axios from "axios";

import UserLayoutService from "./userLayout.service";

const API_URL = "http://investlink-backend-1:5000/v1/";

class AuthService {
  async login(user_name, password) {
    try {
      const response = await axios.post(API_URL + "user/login", { user_name, password });
      if (response.status === 200) {
        const { access_token, profile, name, user_name } = response.data;
        sessionStorage.setItem("user", JSON.stringify({ profile, name, user_name, access_token }));

        try {
          // Carregar o layout após o login
          const layout = await UserLayoutService.getLayout("ListaAcoes");
          if (layout) {
            sessionStorage.setItem('stateListaAcoes', layout);
          } else {
            sessionStorage.removeItem('stateListaAcoes');
          }
        } catch (error) {
          sessionStorage.removeItem('stateListaAcoes');
        }
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
        const { access_token, profile, name, user_name } = response.data;
        sessionStorage.setItem("user", JSON.stringify({ profile, name, user_name, access_token }));
      }
      return response;
    } catch (error) {
      return error.response;
    }
  }  

  getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.profile : null;
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

  isAdmin() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user && user.profile === "ADMIN";
  }
}

const authServiceInstance = new AuthService();

export default authServiceInstance;