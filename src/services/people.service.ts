import api from "@/lib/axios";
import type {
  Person,
  CreatePersonDto,
  UpdatePersonDto,
} from "@/types/person.types";
import type { PaginatedResponse, SearchFilters, FaceSearchFilters, FaceSearchResponse } from "@/types/common.types";

export const peopleService = {
  async getAll(params: SearchFilters): Promise<PaginatedResponse<Person>> {
    const response = await api.get<PaginatedResponse<Person>>("/people", { params });
    return response.data;
  },

  async create(data: CreatePersonDto): Promise<Person> {
    const response = await api.post<Person>("/people", data);
    return response.data;
  },

  async update(id: number, data: UpdatePersonDto): Promise<Person> {
    const response = await api.patch<Person>(`/people/${id}`, data);
    return response.data;
  },

  async checkByCpf(cpf: string): Promise<Person | null> {
    const response = await api.get<Person | null>(`/people/cpf/${cpf}`);
    return response.data;
  },

  async getById(id: number): Promise<Person> {
    const response = await api.get<Person>(`/people/${id}`);
    return response.data;
  },

  async searchByFace(params: FaceSearchFilters): Promise<FaceSearchResponse> {
    const formData = new FormData();
    formData.append('image', params.image);
    formData.append('limit', String(params.limit || 10));
    formData.append('threshold', String(params.threshold || 0.5));

    const response = await api.post<FaceSearchResponse>('/people/search-by-face', formData, {
      timeout: 60000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Backend retorna array direto
    return response.data;
  },
};
