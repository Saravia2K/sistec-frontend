import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "@/lib/axios";
import { TClient, TTechnician, TUser } from "@/lib/types";

interface AuthState {
  user:
    | null
    | (TUser & { customer: TClient | null; technician: TTechnician | null });
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  // eslint-disable  @typescript-eslint/no-explicit-any
  login: (userData: { user: any; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData) => {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${userData.token}`,
        };
        set({
          user: userData.user,
          token: userData.token,
          isAuthenticated: true,
        });
      },
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // eslint-disable  @typescript-eslint/no-explicit-any
        return null as any; // Para Server Components
      }),
    }
  )
);
