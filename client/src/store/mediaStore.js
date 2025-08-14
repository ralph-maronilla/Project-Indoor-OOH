import { create } from 'zustand';

const useMediaStore = create((set) => ({
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
}));

export { useMediaStore };
