import type { LucideIcon } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SectionTitleProps {
  icon: LucideIcon;
  children: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * SectionTitle
 * Consistent card heading used across all section panels.
 */
export function SectionTitle({ icon: Icon, children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
      </div>
      <h3
        className="text-base font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {children}
      </h3>
    </div>
  );
}
