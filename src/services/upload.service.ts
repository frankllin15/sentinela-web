import api from '@/lib/axios';

export const uploadService = {
  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },

  async uploadMultiple(files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.upload(file)));
  },
};
