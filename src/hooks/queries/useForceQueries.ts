import { useQuery } from '@tanstack/react-query';
import { forceService } from '@/services/force.service';
import { queryKeys } from '@/lib/query-keys';

export function useForceList() {
  return useQuery({
    queryKey: queryKeys.forces.all,
    queryFn: () => forceService.getAll(),
  });
}
