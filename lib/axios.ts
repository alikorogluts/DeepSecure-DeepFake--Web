import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Bu çok önemli!
});

// Her isteğe başlıkları zorla ekleyelim
api.interceptors.request.use((config) => {
  config.headers['X-Client-Platform'] = 'web';
  config.headers['X-Client-Token'] = process.env.NEXT_PUBLIC_CLIENT_TOKEN;
  return config;
});