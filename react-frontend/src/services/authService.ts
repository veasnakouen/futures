import api from "./api";
import { useAuthStore } from "../store/authStore";

const API_URL = "/auth";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
  roles: string[];
  photo?: string;
}

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_URL + "/login", {
      username,
      password,
    });
    if (response.data.token) {
      useAuthStore.getState().login(response.data);
    }
    return response.data;
  }

  logout() {
    useAuthStore.getState().logout();
  }

  getCurrentUser(): AuthResponse | null {
    return useAuthStore.getState().user;
  }

  async refreshToken() {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No user logged in");

    const response = await api.post(API_URL + "/refresh", {
      refreshToken: user.refreshToken,
    });

    if (response.data.token) {
      useAuthStore.getState().updateToken(response.data.token);
    }
    return response.data;
  }
}

export default new AuthService();
