import { useQuery } from '@tanstack/react-query';
import { peopleService } from '@/services/people.service';
import { queryKeys } from '@/lib/query-keys';
import type { SearchFilters } from '@/types/common.types';

export function usePersonById(id: number | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.people.detail(id!),
    queryFn: () => peopleService.getById(id!),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function usePersonByCpf(
  cpf: string,
  options?: { enabled?: boolean; ignorePersonId?: number }
) {
  return useQuery({
    queryKey: queryKeys.people.byCpf(cpf),
    queryFn: async () => {
      const person = await peopleService.checkByCpf(cpf);
      // Filtrar pessoa sendo editada (duplicate check)
      if (person && options?.ignorePersonId && person.id === options.ignorePersonId) {
        return null;
      }
      return person;
    },
    enabled: !!cpf && cpf.length === 11 && (options?.enabled ?? true),
    staleTime: 30 * 1000, // Stale time menor para validações
  });
}

export function usePeopleList(filters: SearchFilters) {
  // Converter isConfidential de string para boolean se necessário
  const processedFilters: SearchFilters = {
    ...filters,
    isConfidential:
      typeof filters.isConfidential === 'string' && filters.isConfidential !== ''
        ? filters.isConfidential === 'true'
        : filters.isConfidential as boolean | undefined,
  };

  return useQuery({
    queryKey: queryKeys.people.list(processedFilters),
    queryFn: () => peopleService.getAll(processedFilters),
  });
}
