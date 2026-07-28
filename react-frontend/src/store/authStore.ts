import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  branch?: string;
  roles: string[];
  token: string;
  refreshToken: string;
  photo?: string;
  avatarUrl?: string;
  tenantType?: string;
  allowedModules?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateToken: (newToken: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
        if (typeof window !== "undefined") {
          const Cookies = require('js-cookie');
          if (userData.token) Cookies.set("auth-token", userData.token, { path: '/' });
          if (userData.tenantType) Cookies.set("tenant-type", userData.tenantType, { path: '/' });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("auth-storage"); // Explicit clear if needed
          const Cookies = require('js-cookie');
          Cookies.remove("auth-token", { path: '/' });
          Cookies.remove("tenant-type", { path: '/' });
        }
      },
      updateToken: (newToken) =>
        set((state) => {
          if (typeof window !== "undefined") {
            const Cookies = require('js-cookie');
            if (newToken) Cookies.set("auth-token", newToken, { path: '/' });
          }
          return {
            user: state.user ? { ...state.user, token: newToken } : null,
          };
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => typeof window !== "undefined" ? window.localStorage : ({} as any)),
    },
  ),
);
