'use client';

import { useState, useEffect } from 'react';

export interface GaugeChartProps {
  value: number;
  label: string;
  variant: 'danger' | 'success';
}

const R = 50;
const C = 2 * Math.PI * R;

export function GaugeChart({ value, label, variant }: GaugeChartProps) {
  const [anim, setAnim] = useState(0);
  const color = variant === 'danger' ? 'var(--red)' : 'var(--green)';
  const offset = C - (anim / 100) * C;

  useEffect(() => {
    const t = setTimeout(() => setAnim(value), 150);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--border-base)" strokeWidth="8" />
          <circle cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tabular-nums" style={{ color, fontFamily: 'var(--mono)' }}>{anim}</span>
          <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--t2)' }}>/ 100</span>
        </div>
      </div>
      <span className="text-xs" style={{ color: 'var(--t2)' }}>{label}</span>
    </div>
  );
}