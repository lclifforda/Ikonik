import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminStore = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      login: (token: string) => {
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
      setToken: (token: string | null) => {
        set({ 
          token, 
          isAuthenticated: token !== null 
        });
      },
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
