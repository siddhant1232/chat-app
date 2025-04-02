import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface AuthState {
  authUser: any | null;
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set((state) => ({ ...state, authUser: res.data }));
    } catch (error) {
      console.error("Auth check failed:", error);
      set((state) => ({ ...state, authUser: null }));
    } finally {
      set((state) => ({ ...state, isCheckingAuth: false }));
    }
  },
}));
