import { api } from '@/lib/axios';

export const AuthService = {
  checkStatus: async () => {
    const response = await api.get('/api/v1/auth'); // Backend'deki GET metodumuz
    return response.data;
  },
  // Yeni token (çerez) oluşturur
  generateToken: async () => {
    const response = await api.post('/api/v1/auth', { platform: 'web' });
    return response.data;
  }
};