export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchFilters {
  fullName?: string;
  nickname?: string;
  cpf?: string;
  motherName?: string;
  page: number;
  limit: number;
}
