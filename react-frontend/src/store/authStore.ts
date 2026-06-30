import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  username: string;
  email: string;
  roles: string[];
  token: string;
  refreshToken: string;
  photo?: string;
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
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") window.localStorage.removeItem("auth-storage"); // Explicit clear if needed
      },
      updateToken: (newToken) =>
        set((state) => ({
          user: state.user ? { ...state.user, token: newToken } : null,
        })),
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
