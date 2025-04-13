import { TClient, TTechnician, TUser } from "@/lib/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user:
    | null
    | (TUser & { customer: TClient | null; technician: TTechnician | null });
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (userData: { user: any; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData) =>
        set({
          user: userData.user,
          token: userData.token,
          isAuthenticated: true,
        }),
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
        return null as any; // Para Server Components
      }),
    }
  )
);
