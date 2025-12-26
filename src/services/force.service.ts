import api from '@/lib/axios';
import type { Force } from '@/types/force.types';

export const forceService = {
  async getAll(): Promise<Force[]> {
    const response = await api.get<Force[]>('/forces');
    return response.data;
  },
};
