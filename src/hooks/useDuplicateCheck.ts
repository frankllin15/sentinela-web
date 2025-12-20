import { useDebounce } from '@/hooks/useDebounce';
import { usePersonByCpf } from '@/hooks/queries/usePeopleQueries';
import type { Person } from '@/types/person.types';

interface UseDuplicateCheckReturn {
  isDuplicate: boolean;
  duplicateData: Person | null;
  isChecking: boolean;
}

export function useDuplicateCheck(
  cpf: string,
  ignorePersonId?: number
): UseDuplicateCheckReturn {
  const debouncedCpf = useDebounce(cpf, 500);

  const { data: duplicateData, isLoading: isChecking } = usePersonByCpf(
    debouncedCpf,
    { ignorePersonId }
  );

  const isDuplicate = !!duplicateData;

  return { isDuplicate, duplicateData: duplicateData ?? null, isChecking };
}
