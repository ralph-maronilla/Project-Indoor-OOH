import { create } from 'zustand';

export const useAppStateStore = create((set) => ({
  isAuthenticated: false,
  authUser: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthUser: (value) => set({ authUser: value }),

  resetIsAuthenticated: () => set({ isAuthenticated: false }),
  resetAuthUser: () => set({ authUser: null }),
  login: (user) => set({ authUser: user, isAuthenticated: true }),
  logout: () => set({ authUser: null, isAuthenticated: false }),

  checkAuth: async (checkAuthUrl) => {
    try {
      const response = await fetch(checkAuthUrl, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Not authenticated');

      const data = await response.json();
      set({ authUser: data.user, isAuthenticated: true });
      return data.user;
    } catch (err) {
      set({ authUser: null, isAuthenticated: false });
      return null;
    }
  },

  portalCheckAuthUrl:
    'http://portal.davidandgolyat.com:7777/dng-google-user-portal/api/v1/auth/system/check-auth',
  portalUrl: 'http://portal.davidandgolyat.com:7777/login',

  // portalUrl: "http://portal.davidandgolyat.com:7777/login",
  // portalCheckAuthUrl:
  //   "http://localhost:8038/dng-google-user-portal/api/v1/auth/google/callback/admin",
  // portalUrl: "http://localhost:5173/login",
}));
