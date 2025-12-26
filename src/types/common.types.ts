export interface PaginatedResponse<T> {
  /** Array de itens da página atual */
  data: T[];

  /** Total de itens em todas as páginas */
  total: number;

  /** Número da página atual (1-indexed) */
  page: number;

  /** Quantidade de itens por página */
  limit: number;

  /** Total de páginas (calculado como Math.ceil(total / limit)) */
  totalPages: number;
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
