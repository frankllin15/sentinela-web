import api from "@/lib/axios";
import type { UploadCategory } from "@/types/upload-category";

export const uploadService = {
  // Agora aceita a categoria como segundo parâmetro
  upload: async (file: File, category: UploadCategory): Promise<string> => {
   // 1. FORÇAR DOWNLOAD/LEITURA:
    // Isso obriga o browser mobile a resolver o arquivo do Drive/Cloud
    const arrayBuffer = await file.arrayBuffer();
    const forcedBlob = new Blob([arrayBuffer], { type: file.type });

    const formData = new FormData();
    // Passamos o nome original manualmente para garantir
    formData.append("file", forcedBlob, file.name); 
    formData.append("category", category);

    try {
      // IMPORTANTE: Usar api.post (não postForm) e NÃO definir Content-Type manualmente
      // O interceptor no axios.ts (linha 31-33) detecta FormData e remove o Content-Type
      // permitindo que o browser adicione automaticamente com o boundary correto
      const response = await api.post<{ url: string }>("/upload", formData, {
        timeout: 60000, // 60 segundos para conexões lentas no mobile
      });

      return response.data.url;
    } catch (error) {
      console.error("Erro no upload:", error);

      // Log mais detalhado para debug
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status: number; data: unknown };
        };
        console.error("Status HTTP:", axiosError.response?.status);
        console.error("Resposta do servidor:", axiosError.response?.data);
      }

      throw error;
    }
  },
};
