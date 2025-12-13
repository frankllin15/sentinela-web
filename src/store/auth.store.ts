import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials: LoginCredentials) => {
        const response = await authService.login(credentials);

        set({
          user: response.user,
          token: response.access_token,
          isAuthenticated: true,
        });

        storage.setToken(response.access_token);
        storage.setUser(response.user);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        storage.clearAuth();
      },

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      initialize: async () => {
        set({ isLoading: true });
        const token = storage.getToken();

        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const user = await authService.getProfile();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          storage.clearAuth();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'sentinela-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
