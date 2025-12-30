import type { Person } from "./person.types";

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

export interface FaceSearchFilters {
  image: File;          // Arquivo de imagem para busca
  limit?: number;       // 1-50, default 10
  threshold?: number;   // 0-1, default 0.5
  searchId?: string;    // ID único para cada busca (evita cache)
}

export interface FaceSearchResult {
  person: Person;
  similarity: number;  // 0-1 similarity score
  distance: number;    // Distância euclidiana
  facePhotoUrl: string; // URL da foto que deu match
}

// Backend retorna array direto, não objeto paginado
export type FaceSearchResponse = FaceSearchResult[];
