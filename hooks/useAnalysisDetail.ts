import { useCallback } from 'react';
import { AnalysisService } from '@/services/analysis.service';
import { AnalysisResultResponseDto } from '@/types/analysis.types';
import { useApiRetry } from '@/hooks/useApiRetry';

export function useAnalysisDetail(id: string) {
  const request = useCallback(() => AnalysisService.getResult(id), [id]);

  return useApiRetry<AnalysisResultResponseDto>({
    enabled: Boolean(id),
    request,
    notFoundMessage: 'Analiz bulunamadı.',
    fallbackErrorMessage: 'Analiz detayları şu anda alınamadı. Lütfen daha sonra tekrar deneyin.',
    logMessage: 'Detay çekilemedi:',
  });
}
