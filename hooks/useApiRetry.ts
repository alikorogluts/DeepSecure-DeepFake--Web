import { useCallback, useEffect, useState } from 'react';
import { getApiErrorKind, getRetryDelay, getRetryStatusMessage, isRetryableApiError } from '@/lib/api-retry';
import { getApiErrorMessage, logDevError } from '@/lib/error-message';

interface UseApiRetryOptions<T> {
  enabled?: boolean;
  request: () => Promise<T>;
  notFoundMessage?: string;
  fallbackErrorMessage?: string;
  logMessage?: string;
}

export function useApiRetry<T>({
  enabled = true,
  request,
  notFoundMessage = 'Analiz bulunamadı.',
  fallbackErrorMessage = 'İşlem şu anda tamamlanamadı. Lütfen daha sonra tekrar deneyin.',
  logMessage = 'API isteği başarısız oldu:',
}: UseApiRetryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [manualRetryKey, setManualRetryKey] = useState(0);

  const retryNow = useCallback(() => {
    setManualRetryKey(key => key + 1);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    const run = async () => {
      try {
        setLoading(true);
        setRetrying(attempt > 0);
        setError(null);

        const response = await request();
        if (cancelled) return;

        setData(response);
        setLoading(false);
        setRetrying(false);
        setRetryAttempt(0);
      } catch (err) {
        if (cancelled) return;

        logDevError(logMessage, err);
        const kind = getApiErrorKind(err);

        if (isRetryableApiError(err)) {
          attempt += 1;
          setRetryAttempt(attempt);
          setRetrying(true);
          setLoading(true);
          setError(getRetryStatusMessage(attempt));
          timeoutId = setTimeout(run, getRetryDelay(attempt));
          return;
        }

        setRetrying(false);
        setLoading(false);
        setRetryAttempt(0);

        if (kind === 'not-found') {
          setError(notFoundMessage);
          return;
        }

        if (kind === 'auth') {
          setError('Oturum bilgisi yenilenemedi. Lütfen sayfayı yenileyin.');
          return;
        }

        setError(getApiErrorMessage(err, fallbackErrorMessage));
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, manualRetryKey, request, notFoundMessage, fallbackErrorMessage, logMessage]);

  return {
    data,
    loading,
    error,
    retrying,
    retryAttempt,
    retryMessage: getRetryStatusMessage(retryAttempt),
    retryNow,
  };
}
