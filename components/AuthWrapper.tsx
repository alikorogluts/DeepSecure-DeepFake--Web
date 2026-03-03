'use client';

import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/** Single responsibility: gate the app behind a ready auth session */
export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isReady, error } = useAuth();

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div
          className="card max-w-xs w-full p-8 flex flex-col items-center text-center gap-4"
          style={{ borderColor: 'rgba(248,113,113,0.25)' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--red-soft)' }}>
            <ShieldAlert className="w-5 h-5" style={{ color: 'var(--red)' }} />
          </div>
          <div>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--red)' }}>Bağlantı Reddedildi</h2>
            <p className="text-sm" style={{ color: 'var(--t2)' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--border-base)' }} />
            <div className="absolute inset-0 rounded-full spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--green)' }} />
          </div>
          <p className="text-xs uppercase tracking-widest breathe" style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
            Bağlanıyor
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}