import { useQueries } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { peopleService } from '@/services/people.service';
import { mediaService } from '@/services/media.service';

export function usePersonWithMedia(personId: number | undefined) {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.people.detail(personId!),
        queryFn: () => peopleService.getById(personId!),
        enabled: !!personId,
      },
      {
        queryKey: queryKeys.media.byPerson(personId!),
        queryFn: () => mediaService.getByPersonId(personId!),
        enabled: !!personId,
      },
    ],
  });

  const [personQuery, mediaQuery] = results;

  return {
    person: personQuery.data,
    media: mediaQuery.data,
    isLoading: personQuery.isLoading || mediaQuery.isLoading,
    isError: personQuery.isError || mediaQuery.isError,
    error: personQuery.error || mediaQuery.error,
  };
}
