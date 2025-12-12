import axios from 'axios';
import { storage } from './storage';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Dynamically import to avoid circular dependency
      const { useAuthStore } = await import('@/store/auth.store');
      const logout = useAuthStore.getState().logout;
      logout();

      toast.error('Sessão expirada. Faça login novamente.');
    }

    return Promise.reject(error);
  }
);

export default api;
