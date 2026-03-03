'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';

import { useAnalysisDetail } from '@/hooks/useAnalysisDetail';
import { Lightbox } from '@/components/ui/Lightbox';
import { DetailHeader } from '@/components/analysis-detail/DetailHeader';
import { ConfidenceCard } from '@/components/analysis-detail/ConfidenceCard';
import { ExifCard } from '@/components/analysis-detail/ExifCard';
import { ImageLayersGrid } from '@/components/analysis-detail/ImageLayersGrid';
import BackgroundEffects from '@/components/home/BackgroundEffects';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LightboxState {
  src: string;
  alt: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────
/**
 * AnalysisDetailPage
 * Thin composition layer — owns routing params and lightbox state only.
 * All rendering delegated to focused child components.
 */
export default function AnalysisDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useAnalysisDetail(id);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
        <BackgroundEffects />
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
        <p
          className="text-xs uppercase tracking-widest animate-pulse"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Rapor hazırlanıyor
        </p>
      </div>
    );
  }

  // ── Error ──
  if (error || !data?.result) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <BackgroundEffects />
        <div
          className="card max-w-sm w-full p-8 flex flex-col items-center text-center gap-4"
          style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}
        >
          <AlertCircle className="w-10 h-10" style={{ color: 'var(--danger)' }} />
          <div>
            <h2
              className="text-lg font-bold mb-1"
              style={{ color: '#fca5a5', fontFamily: 'var(--font-display)' }}
            >
              Rapor Bulunamadı
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error || 'Bu analize ait detaylı verilere ulaşılamıyor.'}
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const { result } = data;

  // ── Success ──
  return (
    <>
      <BackgroundEffects />

      {/* Lightbox (portal-like, fixed overlay) */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Sticky top nav */}
      <DetailHeader isDeepfake={result.isDeepfake} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column: scores + EXIF */}
          <div className="space-y-6">
            <ConfidenceCard
              cnnConfidence={result.cnnConfidence}
              isDeepfake={result.isDeepfake}
              elaScore={result.elaScore}
              fftAnomalyScore={result.fftAnomalyScore}
            />
            <ExifCard exifAnalysis={result.exifAnalysis} />
          </div>

          {/* Right column: image layers */}
          <div className="lg:col-span-2">
            <ImageLayersGrid
              originalImagePath={result.originalImagePath}
              gradcamImagePath={result.gradcamImagePath}
              elaImagePath={result.elaImagePath}
              fftImagePath={result.fftImagePath}
              onExpand={setLightbox}
            />
          </div>

        </div>
      </main>
    </>
  );
}
