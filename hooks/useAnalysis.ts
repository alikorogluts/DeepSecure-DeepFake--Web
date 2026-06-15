import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnalysisService } from '@/services/analysis.service';
import { AnalysisStatus } from '@/types/analysis.types';
import { getApiErrorMessage, logDevError } from '@/lib/error-message';
import { getApiErrorKind, getRetryDelay, getRetryStatusMessage, isRetryableApiError } from '@/lib/api-retry';

export function useAnalysis() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {     
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;
    let attempt = 0;

    if (activeId && (status === 'Pending' || status === 'Processing')) {
      const poll = async () => {
        try {
          const data = await AnalysisService.getResult(activeId); // Servis kullanılıyor
          if (cancelled) return;

          attempt = 0;
          setRetrying(false);
          setRetryAttempt(0);
          setStatus(data.status);

          if (data.status === 'Completed') {
            toast.success("Analiz başarıyla tamamlandı!");
            setTimeout(() => { setActiveId(null); setStatus(null); }, 5000);
            return;
          } 
          
          if (data.status === 'Failed') {
            toast.error("Analiz başarısız oldu.");
            return;
          }

          timeoutId = setTimeout(poll, 3000);
        } catch (error) {
          if (cancelled) return;

          logDevError('Analiz durumu güncellenemedi:', error);
          const kind = getApiErrorKind(error);

          if (isRetryableApiError(error)) {
            attempt += 1;
            setRetrying(true);
            setRetryAttempt(attempt);
            timeoutId = setTimeout(poll, getRetryDelay(attempt));
            return;
          }

          setRetrying(false);
          setRetryAttempt(0);

          if (kind === 'not-found') {
            toast.error('Analiz bulunamadı.');
            setStatus('Failed');
            return;
          }

          if (kind === 'auth') {
            toast.error('Oturum bilgisi yenilenemedi. Lütfen sayfayı yenileyin.');
            setStatus('Failed');
            return;
          }

          toast.error(getApiErrorMessage(error, 'Analiz durumu güncellenemedi. Lütfen birazdan tekrar kontrol edin.'));
          setStatus('Failed');
        }
      };

      poll();
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeId, status]);

  return {
    activeId,
    setActiveId,
    status,
    setStatus,
    retrying,
    retryAttempt,
    retryMessage: getRetryStatusMessage(retryAttempt),
  };
}
