import { useState, useEffect } from 'react';
import { AnalysisService } from '@/services/analysis.service';
import { HistoryItemDto } from '@/types/analysis.types';

export function useAnalysisHistory() {
  const [history, setHistory] = useState<HistoryItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  // ✅ 1. Hata state'ini buraya ekledik
  const [error, setError] = useState<string | null>(null); 

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null); // ✅ Her yeni istekte eski hatayı temizle
      
      const data = await AnalysisService.getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Geçmiş yüklenemedi:', err);
      // ✅ 2. Hata durumunda state'i doldur
      setError('Geçmiş analizler yüklenirken bir sorun oluştu.'); 
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchHistory(); 
  }, []);

  // ✅ 3. error state'ini dışarı aktar (Bileşen artık bunu kullanabilecek)
  return { history, loading, error, refetch: fetchHistory }; 
}