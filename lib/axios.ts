import axios from 'axios';

export const api = axios.create({
  // DEĞİŞİKLİK BURADA: Artık doğrudan backend'e değil, kendi proxy'mize gidiyoruz
  baseURL: '/api/proxy', 
  withCredentials: true, // Safari'nin çerezleri (cookie) Next.js'e göndermesi için şart
});

// Her isteğe başlıkları zorla ekleyelim (Burası aynen kalıyor)
api.interceptors.request.use((config) => {
  config.headers['X-Client-Platform'] = 'web';
  config.headers['X-Client-Token'] = process.env.NEXT_PUBLIC_CLIENT_TOKEN;
  return config;
});

/*
todo : burda yine maskeleme kısmının değişen diğer ksımı domain işi çözlürse kullnaman gerekn kod burda (next.config.ts dosyasını değişmeyi unutma)

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

*/