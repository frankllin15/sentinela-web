import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api-error';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min - evita refetch desnecessário
      gcTime: 10 * 60 * 1000,   // 10 min cache após unmount
      retry: (failureCount, error) => {
        // Não retentar erros 4xx (client errors)
        if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        return failureCount < 1; // 1 retry para network/5xx
      },
      refetchOnWindowFocus: false, // Cenário de campo
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export { queryClient };
