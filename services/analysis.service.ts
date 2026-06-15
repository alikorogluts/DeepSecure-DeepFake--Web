import { api } from '@/lib/axios';
import { AxiosProgressEvent } from 'axios';
import { 
  UploadResponseDto, 
  AnalysisResultResponseDto, 
  PaginatedHistoryResponseDto, 
  HistoryItemDto 
} from '@/types/analysis.types';

const historyPageRequests = new Map<string, Promise<PaginatedHistoryResponseDto>>();

export const AnalysisService = {
  // Yükleme
  upload: async (formData: FormData, onProgress: (e: AxiosProgressEvent) => void): Promise<UploadResponseDto> => {
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
  getHistoryPage: async (page = 1, pageSize = 12): Promise<PaginatedHistoryResponseDto> => {
    const requestKey = `${page}:${pageSize}`;
    const pendingRequest = historyPageRequests.get(requestKey);
    if (pendingRequest) return pendingRequest;

    const request = api.get<PaginatedHistoryResponseDto>('/api/v1/analyses', {
      params: { page, pageSize },
    }).then(response => response.data)
      .finally(() => {
        historyPageRequests.delete(requestKey);
      });

    historyPageRequests.set(requestKey, request);
    return request;
  },

  getHistory: async (page = 1, pageSize = 12): Promise<HistoryItemDto[]> => {
    const response = await AnalysisService.getHistoryPage(page, pageSize);
    return response.data; // DTO'daki "Data" listesini döndürüyoruz
  }
};
