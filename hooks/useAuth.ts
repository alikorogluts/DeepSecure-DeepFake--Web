import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/error-message';
import { getApiErrorKind, getRetryDelay, getRetryStatusMessage, isRetryableApiError } from '@/lib/api-retry';

export function useAuth() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [manualRetryKey, setManualRetryKey] = useState(0);

  const retryNow = useCallback(() => {
    setManualRetryKey(key => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    const authenticate = async () => {
      try {
        setError(null);
        // 1. Önce kullanıcının mevcut bir oturumu/çerezi var mı diye bakıyoruz
        await AuthService.checkStatus();
        if (cancelled) return;

        setIsReady(true);
        setRetrying(false);
        setRetryAttempt(0);
      } catch (err) {
        if (cancelled) return;

        // 2. Eğer yetkisiz (401) dönerse, demek ki ilk defa giriyor. Token üret!
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await AuthService.generateToken();
            if (cancelled) return;

            setIsReady(true);
            setRetrying(false);
            setRetryAttempt(0);
          } catch (tokenErr) {
            if (cancelled) return;

            if (isRetryableApiError(tokenErr)) {
              attempt += 1;
              setRetrying(true);
              setRetryAttempt(attempt);
              timeoutId = setTimeout(authenticate, getRetryDelay(attempt));
              return;
            }

            setRetrying(false);
            if (getApiErrorKind(tokenErr) === 'auth') {
              setError('Oturum bilgisi yenilenemedi. Lütfen sayfayı yenileyin.');
              return;
            }

            // Token üretirken Rate Limit'e (429) takılırsa burası çalışır
            setError(getApiErrorMessage(tokenErr, 'Güvenlik anahtarı oluşturulamadı.'));
          }
        } else {
          if (isRetryableApiError(err)) {
            attempt += 1;
            setRetrying(true);
            setRetryAttempt(attempt);
            timeoutId = setTimeout(authenticate, getRetryDelay(attempt));
            return;
          }

          // 401 dışındaki diğer hatalar (500, Ağ hatası vs.)
          setRetrying(false);
          if (getApiErrorKind(err) === 'auth') {
            setError('Oturum bilgisi yenilenemedi. Lütfen sayfayı yenileyin.');
            return;
          }

          setError(getApiErrorMessage(err, 'Sunucuya güvenli bağlantı kurulamadı.'));
        }
      }
    };

    authenticate();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [manualRetryKey]);

  return {
    isReady,
    error,
    retrying,
    retryAttempt,
    retryMessage: getRetryStatusMessage(retryAttempt),
    retryNow,
  };
}
