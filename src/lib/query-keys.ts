import type { SearchFilters } from "@/types/common.types";

export const queryKeys = {
  people: {
    all: ['people'] as const,
    lists: () => [...queryKeys.people.all, 'list'] as const,
    list: (filters: SearchFilters) => [...queryKeys.people.lists(), filters] as const,
    details: () => [...queryKeys.people.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.people.details(), id] as const,
    byCpf: (cpf: string) => [...queryKeys.people.all, 'cpf', cpf] as const,
  },
  media: {
    all: ['media'] as const,
    byPerson: (personId: number) => [...queryKeys.media.all, 'person', personId] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: SearchFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  forces: {
    all: ['forces'] as const,
  },
};



