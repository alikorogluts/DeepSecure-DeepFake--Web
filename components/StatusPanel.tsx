'use client';

import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisStatus } from '@/types/analysis.types';

// ── Single responsibility: render analysis status bar ─────────────────────────

interface StatusPanelProps {
  status: AnalysisStatus | null;
  id: string;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  color: string;       /* text + icon */
  bg: string;          /* background */
  border: string;      /* border color */
  dot?: boolean;       /* animated pulse dot */
}

const CONFIG: Record<AnalysisStatus, StatusConfig> = {
  Pending: {
    label: 'Analiz sırasına alındı',
    color: 'var(--yellow)',
    bg: 'var(--yellow-soft)',
    border: 'rgba(251,191,36,0.25)',
    dot: true,
    icon: <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--yellow)' }} />,
  },
  Processing: {
    label: 'AI katmanları taranıyor…',
    color: 'var(--blue)',
    bg: 'var(--blue-soft)',
    border: 'rgba(96,165,250,0.25)',
    dot: true,
    icon: <Loader2 className="w-4 h-4 shrink-0 spin" style={{ color: 'var(--blue)' }} />,
  },
  Completed: {
    label: 'Analiz tamamlandı',
    color: 'var(--green)',
    bg: 'var(--green-soft)',
    border: 'var(--border-accent)',
    dot: false,
    icon: <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--green)' }} />,
  },
  Failed: {
    label: 'Analiz başarısız oldu',
    color: 'var(--red)',
    bg: 'var(--red-soft)',
    border: 'rgba(248,113,113,0.25)',
    dot: false,
    icon: <XCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--red)' }} />,
  },
};

export function StatusPanel({ status, id }: StatusPanelProps) {
  const cfg = CONFIG[status ?? 'Pending'];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-lg flex items-center justify-between gap-3 px-4 py-2.5 mt-3"
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 'var(--r3)',
        }}
      >
        {/* Left: icon + label */}
        <div className="flex items-center gap-2.5">
          {cfg.icon}
          <span className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</span>

          {/* Animated dot for in-progress states */}
          {cfg.dot && (
            <span className="flex gap-0.5 ml-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: cfg.color,
                    animation: `breathe 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </span>
          )}
        </div>

        {/* Right: ID */}
        <span
          className="text-[10px] shrink-0"
          style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}
        >
          #{id.substring(0, 8)}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}