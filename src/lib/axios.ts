import axios, { AxiosError } from 'axios';
import { storage } from './storage';
import { toast } from 'sonner';
import { type ErrorResponseDto } from '@/types/error-response';
import { ApiError } from '@/types/api-error';

// 1. Extensão de Tipagem do Axios
// Isso permite passar { silent: true } sem o TypeScript reclamar
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * Se true, suprime os Toasts automáticos de erro para esta requisição.
     * Útil para validações em background ou polling.
     */
    silent?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  
});

// Request interceptor (Mantido)
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseDto>) => {
    const originalRequest = error.config;
    
    // VERIFICAÇÃO SILENCIOSA:
    // Se a requisição pediu silêncio, rejeitamos o erro sem mostrar UI (Toast),
    // a menos que seja um 401 (que força logout/redirect e geralmente precisa de aviso).
    const isSilent = originalRequest?.silent === true;

    // 1. Tratamento de Erro de Conexão
    if (!error.response) {
        toast.error('Não foi possível conectar ao servidor. Verifique sua internet.');
      return Promise.reject(new Error('Erro de conexão'));
    }

    const { data, status } = error.response;

    // 2. Tratamento de Sessão Expirada (401) - Geralmente ignoramos o silent aqui pois afeta a nav
    if (status === 401) {
      const { useAuthStore } = await import('@/store/auth.store');
      const logout = useAuthStore.getState().logout;
      logout();
      
      // Opcional: Você pode decidir se quer respeitar o silent no 401 também.
      // Geralmente é bom avisar que a sessão caiu.
      if (!isSilent) {
        toast.error('Sessão expirada. Faça login novamente.');
      }
      return Promise.reject(error);
    }

    // 3. Normalização do Erro usando DTO
    if (data && typeof data === 'object' && 'errorCode' in data) {
      const apiError = new ApiError(data, error);

      // Só exibe o toast se NÃO for silencioso
      if (!isSilent) {
        if (apiError.isUserFacing) {
          toast.error(apiError.message);
        } else {
          console.error('Erro Técnico:', apiError.details); // Loga para o dev
          toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
      }

      return Promise.reject(apiError);
    }

    // 4. Fallback genérico
    if (!isSilent) {
      toast.error('Erro desconhecido no servidor.');
    }
    return Promise.reject(error);
  }
);

export default api;