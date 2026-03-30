
import axios from 'axios';

export const api = axios.create({
  // Eski haline döndürdük: Doğrudan .NET API'sine gidecek
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true, 
});

// Interceptor aynı kalıyor
api.interceptors.request.use((config) => {
  config.headers['X-Client-Platform'] = 'web';
  config.headers['X-Client-Token'] = process.env.NEXT_PUBLIC_CLIENT_TOKEN;
  return config;
});

