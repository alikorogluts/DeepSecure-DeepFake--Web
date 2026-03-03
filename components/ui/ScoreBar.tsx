'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

export interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  fillColor: string;
  description: string;
  lowNote: string;
  highNote: string;
}

type Zone = 'low' | 'mid' | 'high';
const ZONE_COLORS: Record<Zone, { c: string; bg: string }> = {
  low:  { c: 'var(--green)',  bg: 'var(--green-soft)'  },
  mid:  { c: 'var(--yellow)', bg: 'var(--yellow-soft)' },
  high: { c: 'var(--red)',    bg: 'var(--red-soft)'    },
};
const ZONE_LABELS: Record<Zone, string> = { low: '🟢 Düşük', mid: '🟡 Orta', high: '🔴 Yüksek' };

export function ScoreBar({ label, value, maxValue = 1, fillColor, description, lowNote, highNote }: ScoreBarProps) {
  const [anim, setAnim] = useState(0);
  const [open, setOpen] = useState(false);
  const pct = Math.min(100, (value / maxValue) * 100);
  const zone: Zone = pct < 30 ? 'low' : pct < 65 ? 'mid' : 'high';
  const zc = ZONE_COLORS[zone];
  const note = zone === 'low' ? lowNote : zone === 'high' ? highNote : 'Normal aralıkta — sonuçlar değerlendiriliyor.';

  useEffect(() => { const t = setTimeout(() => setAnim(pct), 300); return () => clearTimeout(t); }, [pct]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium" style={{ color: 'var(--t1)' }}>{label}</span>
          <button onClick={() => setOpen(v => !v)} style={{ color: open ? 'var(--green)' : 'var(--t3)' }}>
            <Info className="w-3 h-3" />
          </button>
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--t1)', fontFamily: 'var(--mono)' }}>
          {value.toFixed(2)}
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-sunken)' }}>
        <div className={`h-full rounded-full ${fillColor}`}
          style={{ width: `${anim}%`, transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </div>

      <div className="flex justify-between text-[10px] uppercase tracking-widest" style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}>
        <span>0</span><span>Normal</span><span>{maxValue}</span>
      </div>

      {open && (
        <div className="mt-1 p-3 rounded-[var(--r2)] space-y-2"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-dim)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--t2)' }}>{description}</p>
          <div className="text-xs p-2 rounded-[var(--r1)]" style={{ color: zc.c, background: zc.bg }}>
            <strong>{ZONE_LABELS[zone]}</strong> — {note}
          </div>
        </div>
      )}
    </div>
  );
}