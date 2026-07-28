import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // Add Tenant ID if it exists in local storage
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem("tenantId") : null;
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bypass refresh logic for login / refresh requests
    if (originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (Expired Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { user, updateToken, logout } = useAuthStore.getState();

      if (user?.refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await axios.post("/api/auth/refresh", {
            refreshToken: user.refreshToken,
          });

          const { accessToken } = response.data;
          updateToken(accessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, log out the user
          logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, log out
        logout();
        window.location.href = "/login";
      }
    }
    // Handle 503 Service Unavailable gracefully (e.g. backend microservice restarting or offline)
    if (error.response?.status === 503) {
      const now = Date.now();
      const lastLog = (window as any)._last503Toast || 0;
      if (typeof window !== "undefined" && now - lastLog > 10000) {
        (window as any)._last503Toast = now;
        console.warn("[API Interceptor] 503 Service Unavailable: Gateway or downstream microservice is offline or initializing.");
      }
    }

    return Promise.reject(error);
  },
);
export default api;
