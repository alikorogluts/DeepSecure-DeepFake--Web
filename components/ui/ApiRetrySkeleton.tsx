'use client';

import { RefreshCw } from 'lucide-react';

interface ApiRetrySkeletonProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ApiRetrySkeleton({
  title = 'Analiz servisine bağlanılıyor…',
  message = 'Sunucu şu anda uyanıyor olabilir. Kısa süre içinde tekrar denenecek.',
  onRetry,
}: ApiRetrySkeletonProps) {
  return (
    <div
      className="card p-6 flex flex-col items-center text-center gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--border-base)' }} />
        <div className="absolute inset-0 rounded-full spin" style={{ border: '2px solid transparent', borderTopColor: 'var(--green)' }} />
      </div>

      <div>
        <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--t1)' }}>{title}</h2>
        <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--t2)' }}>{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-[var(--r2)] text-xs font-semibold flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-85"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', color: 'var(--t1)' }}
        >
          <RefreshCw className="w-3 h-3" style={{ color: 'var(--green)' }} />
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
