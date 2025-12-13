import api from '@/lib/axios';
import type { Person, CreatePersonDto } from '@/types/person.types';

export const peopleService = {
  async create(data: CreatePersonDto): Promise<Person> {
    const response = await api.post<Person>('/people', data);
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
};
