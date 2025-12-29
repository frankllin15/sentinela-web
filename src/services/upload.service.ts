import api from "@/lib/axios";
import type { UploadCategory } from "@/types/upload-category";

export const uploadService = {
  // Agora aceita a categoria como segundo parâmetro
  upload: async (file: File, category: UploadCategory): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category); // Envia o campo extra

    try {
      const response = await api.post<{ url: string }>("/upload", formData);

      return response.data.url;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
    }
  },
};
