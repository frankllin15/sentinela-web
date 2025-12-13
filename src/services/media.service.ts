import api from '@/lib/axios';
import type { Media, CreateMediaDto } from '@/types/media.types';

export const mediaService = {
  async create(data: CreateMediaDto): Promise<Media> {
    const response = await api.post<Media>('/media', data);
    return response.data;
  },

  async createMultiple(dataArray: CreateMediaDto[]): Promise<Media[]> {
    return Promise.all(dataArray.map((data) => this.create(data)));
  },
};
