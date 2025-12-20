import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateMediaDto } from '@/types/media.types';

export function useBulkMediaOperations(personId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operations: {
      create: CreateMediaDto[];
      delete: number[];
    }) => {
      const createPromises = operations.create.map(data => mediaService.create(data));
      const deletePromises = operations.delete.map(id => mediaService.delete(id));
      await Promise.all([...createPromises, ...deletePromises]);
    },
    onSuccess: () => {
      // Invalidar cache de media após alterações
      queryClient.invalidateQueries({
        queryKey: queryKeys.media.byPerson(personId)
      });
    },
  });
}
