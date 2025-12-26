import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/lib/query-keys';
import type { UserSearchFilters } from '@/types/user.types';

export function useUserList(filters: UserSearchFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => userService.getAll(filters),
  });
}

export function useUserById(id: number | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id && (options?.enabled ?? true),
  });
}
