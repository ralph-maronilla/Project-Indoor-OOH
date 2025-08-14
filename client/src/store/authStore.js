import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStateStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      authUser: null,

      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setAuthUser: (value) => set({ authUser: value }),

      resetIsAuthenticated: () => set({ isAuthenticated: false }),
      resetAuthUser: () => set({ authUser: null }),
      login: (user) => set({ authUser: user, isAuthenticated: true }),
      logout: () => set({ authUser: null, isAuthenticated: false }),

      portalCheckAuthUrl:
        'http://portal.davidandgolyat.com:7777/dng-google-user-portal/api/v1/auth/system/check-auth',
      portalUrl: 'http://portal.davidandgolyat.com:7777/login',
    }),
    {
      name: 'app-auth-store', // key for localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        authUser: state.authUser,
      }), // store only these keys
    }
  )
);
