import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  authUser: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthUser: (value) => set({ authUser: value }),

  resetIsAuthenticated: () => set({ isAuthenticated: false }),
  resetAuthUser: () => set({ authUser: null }),
  login: (user, token) => {
    set({ isAuthenticated: true, authUser: user, token });
    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  logout: () => {
    set({ isAuthenticated: false, authUser: null, token: null });
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
  },
}));
