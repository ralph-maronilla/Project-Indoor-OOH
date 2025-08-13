import { create } from "zustand";

export const useAppStateStore = create((set) => ({
  isAuthenticated: false,
  authUser: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthUser: (value) => set({ authUser: value }),

  resetIsAuthenticated: () => set({ isAuthenticated: false }),
  resetAuthUser: () => set({ authUser: null }),

  portalCheckAuthUrl:
    "http://portal.davidandgolyat.com:7777/dng-google-user-portal/api/v1/auth/system/check-auth",
  portalUrl: "http://portal.davidandgolyat.com:7777/login",

  // portalUrl: "http://portal.davidandgolyat.com:7777/login",
  // portalCheckAuthUrl:
  //   "http://localhost:8038/dng-google-user-portal/api/v1/auth/google/callback/admin",
  // portalUrl: "http://localhost:5173/login",
}));
