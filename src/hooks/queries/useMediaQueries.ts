import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';
import { queryKeys } from '@/lib/query-keys';

export function useMediaByPersonId(
  personId: number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.media.byPerson(personId!),
    queryFn: () => mediaService.getByPersonId(personId!),
    enabled: !!personId && (options?.enabled ?? true),
  });
}

export function usePersonFacePhoto(
  personId: number | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.media.byPerson(personId!), 'face'],
    queryFn: async () => {
      const media = await mediaService.getByPersonId(personId!);
      return media.find((m) => m.type === 'FACE') || null;
    },
    enabled: !!personId && (options?.enabled ?? true),
  });
}
