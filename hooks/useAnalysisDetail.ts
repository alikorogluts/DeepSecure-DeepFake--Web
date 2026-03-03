import { useState, useEffect } from 'react';
import { AnalysisService } from '@/services/analysis.service';
import { AnalysisResultResponseDto } from '@/types/analysis.types';

export function useAnalysisDetail(id: string) {
  const [data, setData] = useState<AnalysisResultResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Servisteki getResult metodumuzu kullanıyoruz
        const response = await AnalysisService.getResult(id);
        setData(response);
      } catch (err: any) {
        console.error('Detay çekilemedi:', err);
        setError(err.response?.data?.message || 'Analiz detayları sunucudan alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { data, loading, error };
}