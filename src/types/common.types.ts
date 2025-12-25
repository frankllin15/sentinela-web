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
  fatherName?: string;
  isConfidential?: boolean | string;
  page: number;
  limit: number;
}
