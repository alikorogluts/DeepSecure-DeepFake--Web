import axios from 'axios';

export type ApiErrorKind = 'network' | 'not-found' | 'auth' | 'server' | 'unknown';

export function getRetryDelay(attempt: number) {
  if (attempt <= 1) return 3000;
  if (attempt === 2) return 5000;
  return 10000;
}

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (!axios.isAxiosError(error)) return 'unknown';

  const status = error.response?.status;
  if (!status || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') return 'network';
  if (status === 404) return 'not-found';
  if (status === 401 || status === 403) return 'auth';
  if (status >= 500) return 'server';

  return 'unknown';
}

export function isRetryableApiError(error: unknown) {
  const kind = getApiErrorKind(error);
  return kind === 'network' || kind === 'server';
}

export function getRetryStatusMessage(attempt: number) {
  if (attempt >= 5) {
    return 'Sunucuya bağlanmak beklenenden uzun sürdü. İsterseniz sayfayı yenileyebilir veya biraz sonra tekrar deneyebilirsiniz.';
  }

  return 'Sunucu şu anda uyanıyor olabilir. Kısa süre içinde tekrar denenecek.';
}
