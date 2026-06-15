import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return typeof message === 'string' && message.trim() ? message : fallback;
  }

  return fallback;
}

export function logDevError(message: string, error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
}
