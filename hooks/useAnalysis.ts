import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnalysisService } from '@/services/analysis.service';
import { AnalysisStatus } from '@/types/analysis.types';

export function useAnalysis() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus | null>(null);

  useEffect(() => {     
    let interval: NodeJS.Timeout;

    if (activeId && (status === 'Pending' || status === 'Processing')) {
      interval = setInterval(async () => {
        try {
          const data = await AnalysisService.getResult(activeId); // Servis kullanılıyor
          setStatus(data.status);

          if (data.status === 'Completed') {
            toast.success("Analiz başarıyla tamamlandı!");
            clearInterval(interval);
            setTimeout(() => { setActiveId(null); setStatus(null); }, 5000);
          } 
          
          if (data.status === 'Failed') {
            toast.error("Analiz başarısız oldu.");
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [activeId, status]);

  return { activeId, setActiveId, status, setStatus };
}