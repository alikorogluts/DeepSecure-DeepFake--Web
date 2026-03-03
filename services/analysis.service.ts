import { api } from '@/lib/axios';
import { 
  UploadResponseDto, 
  AnalysisResultResponseDto, 
  PaginatedHistoryResponseDto, 
  HistoryItemDto 
} from '@/types/analysis.types';

export const AnalysisService = {
  // Yükleme
  upload: async (formData: FormData, onProgress: (e: any) => void): Promise<UploadResponseDto> => {
    const response = await api.post<UploadResponseDto>('/api/v1/analyses', formData, {
      onUploadProgress: onProgress
    });
    return response.data;
  },

  // Sonuç (Polling)
  getResult: async (id: string): Promise<AnalysisResultResponseDto> => {
    const response = await api.get<AnalysisResultResponseDto>(`/api/v1/analyses/${id}`);
    return response.data;
  },

  // Geçmiş
  getHistory: async (page = 1, pageSize = 10): Promise<HistoryItemDto[]> => {
    const response = await api.get<PaginatedHistoryResponseDto>('/api/v1/analyses', { 
      params: { page, pageSize } 
    });
    return response.data.data; // DTO'daki "Data" listesini döndürüyoruz
  }
};