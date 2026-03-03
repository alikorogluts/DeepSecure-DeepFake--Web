import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';

export function useAuth() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // 1. Önce kullanıcının mevcut bir oturumu/çerezi var mı diye bakıyoruz
        await AuthService.checkStatus();
        setIsReady(true);
      } catch (err: any) {
        // 2. Eğer yetkisiz (401) dönerse, demek ki ilk defa giriyor. Token üret!
        if (err.response?.status === 401) {
          try {
            await AuthService.generateToken();
            setIsReady(true);
          } catch (tokenErr: any) {
            // Token üretirken Rate Limit'e (429) takılırsa burası çalışır
            setError(tokenErr.response?.data?.message || 'Güvenlik anahtarı oluşturulamadı.');
          }
        } else {
          // 401 dışındaki diğer hatalar (500, Ağ hatası vs.)
          setError(err.response?.data?.message || 'Sunucuya güvenli bağlantı kurulamadı.');
        }
      }
    };

    authenticate();
  }, []);

  return { isReady, error };
}