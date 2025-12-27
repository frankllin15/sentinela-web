import api from '@/lib/axios';
import type { User, CreateUserDto, UpdateUserDto, UserSearchFilters } from '@/types/user.types';
import type { PaginatedResponse } from '@/types/common.types';

export const userService = {
  async getAll(params: UserSearchFilters): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', { params, silent: true });
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async toggleStatus(id: number, isActive: boolean): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, { isActive });
    return response.data;
  },
};
