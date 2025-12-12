import { STORAGE_KEYS } from '@/constants/storage';
import type { User } from '@/types/auth.types';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },
};
