import api from "@/lib/axios";
import type { UploadCategory } from "@/types/upload-category";

export const uploadService = {
  // Agora aceita a categoria como segundo parâmetro
  upload: async (file: File, category: UploadCategory): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category); // Envia o campo extra

    try {
      const response = await api.postForm<{ url: string }>("/upload", formData, {
        timeout: 60000, // 60 segundos,
        
      });

      return response.data.url;
    } catch (error) {
      console.error("Erro no upload:", error);

      // Log mais detalhado para debug
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);// Não definir Content-Type manualmente - o axios detecta FormData
        // e define automaticamente como multipart/form-data com boundary correto
      }

      throw error;
    }
  },
};
