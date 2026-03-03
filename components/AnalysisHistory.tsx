
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { HistoryItemDto } from '@/types/analysis.types';
import { AlertCircle, ArrowUpRight, Clock, ScanSearch } from 'lucide-react';

/** Single responsibility: render list of past analyses */

// ── Status badge — frosted glass so it's always readable over images ──────────
const STATUS_MAP: Record<string, { label: string; dot: string }> = {
  Pending:    { label: 'Bekliyor',    dot: 'var(--yellow)' },
  Processing: { label: 'İşleniyor',  dot: 'var(--blue)'   },
  Completed:  { label: 'Tamamlandı', dot: 'var(--green)'  },
  Failed:     { label: 'Hata',       dot: 'var(--red)'    },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.Completed;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff',
      }}
    >
      {/* Colored dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: s.dot, boxShadow: `0 0 4px ${s.dot}` }}
      />
      {s.label}
    </span>
  );
}

// ── Analysis card ─────────────────────────────────────────────────────────────
function AnalysisCard({ item, index }: { item: HistoryItemDto; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, ease: 'easeOut' }}
    >
      <Link href={`/analysis/${item.analysisId}`} className="group block" style={{ textDecoration: 'none' }}>
        <div
          className="card overflow-hidden transition-all duration-200"
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border-accent)';
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = 'var(--sh-raise)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border-base)';
            el.style.transform = 'none';
            el.style.boxShadow = 'var(--sh-card)';
          }}
        >
          {/* ── Thumbnail ── */}
          <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
            <Image
              src={item.thumbnailPath || '/placeholder.png'}
              alt="Analiz önizlemesi"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              unoptimized
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }}
            />

            {/* Status badge — top right */}
            <div className="absolute top-3 right-3">
              <StatusBadge status="Completed" />
            </div>

            {/* Arrow — top left, appears on hover */}
            <div
              className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}
              >
                #{item.analysisId.substring(0, 8)}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}
              >
                {new Date(item.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>

            {/* Result row */}
            <div
              className="flex items-center justify-between px-3.5 py-3 rounded-[var(--r2)]"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-dim)' }}
            >
              <span
                className="text-sm font-extrabold tracking-tight"
                style={{ color: item.isDeepfake ? 'var(--red)' : 'var(--green)' }}
              >
                {item.isDeepfake ? 'DEEPFAKE' : 'GERÇEK'}
              </span>
              <div className="text-right">
                <p
                  className="text-[10px] uppercase tracking-widest mb-0.5"
                  style={{ color: 'var(--t2)' }}
                >
                  Güven
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: 'var(--t1)', fontFamily: 'var(--mono)' }}
                >
                  %{Math.round(item.cnnConfidence * 100)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── State components ──────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="text-center py-16 rounded-[var(--r4)]"
      style={{ background: 'var(--bg-raised)', border: '1px dashed var(--border-base)' }}
    >
      <ScanSearch className="w-9 h-9 mx-auto mb-3" style={{ color: 'var(--t3)' }} />
      <p className="text-sm font-medium" style={{ color: 'var(--t2)' }}>Henüz bir analiz yok</p>
      <p className="text-xs mt-1" style={{ color: 'var(--t3)' }}>Yukarıdan görsel yükleyerek başla</p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="mb-5 p-3.5 rounded-[var(--r2)] flex items-center gap-2.5 text-sm"
      style={{ background: 'var(--red-soft)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--red)' }}
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="rounded-[var(--r4)] breathe"
          style={{
            height: '264px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-dim)',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnalysisHistory() {
  const { history, loading, error } = useAnalysisHistory();

  return (
    <section className="w-full max-w-5xl mx-auto">
      {/* Heading */}
      <div className="flex items-center gap-2.5 mb-7">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--green-soft)', border: '1px solid var(--border-accent)' }}
        >
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--t1)' }}>Geçmiş Analizler</h2>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading
        ? <SkeletonGrid />
        : history?.length > 0
          ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-stagger">
              {history.map((item, i) => (
                <AnalysisCard key={item.analysisId} item={item} index={i} />
              ))}
            </div>
          )
          : !error && <EmptyState />
      }
    </section>
  );
}