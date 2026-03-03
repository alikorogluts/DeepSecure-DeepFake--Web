'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ScanSearch, Fingerprint } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface LightboxState { src: string; alt: string; }

const LAYERS = [
  { key: 'original', title: 'Orijinal Görsel',        desc: 'Sisteme yüklenen kaynak görsel.' },
  { key: 'gradcam',  title: 'Grad-CAM Isı Haritası',  desc: "Modelin sahte kararı verirken odaklandığı pikseller." },
  { key: 'ela',      title: 'ELA Analizi',             desc: 'Sıkıştırma farklılıkları. Parlak bölgeler müdahaleye işaret eder.' },
  { key: 'fft',      title: 'FFT Frekans Analizi',     desc: 'AI üretim araçlarının bıraktığı periyodik desenler.' },
];

// ── Image with loading skeleton ───────────────────────────────────────────────
function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Skeleton — visible until image loads */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Animated shimmer bars */}
          <div className="w-full h-full absolute inset-0 breathe"
            style={{ background: 'var(--bg-raised)' }}
          />
          {/* Spinner overlay */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid var(--border-base)' }} />
              <div
                className="absolute inset-0 rounded-full spin"
                style={{ border: '2px solid transparent', borderTopColor: 'var(--green)' }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
              Yükleniyor
            </span>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1 transition-all duration-500 group-hover:scale-[1.03]"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        onLoad={() => setLoaded(true)}
        unoptimized
      />
    </>
  );
}

// ── Layer card ────────────────────────────────────────────────────────────────
function LayerCard({ title, imageUrl, description, onExpand }:
  { title: string; imageUrl?: string; description?: string; onExpand: (s: LightboxState) => void }) {

  return (
    <div className="flex flex-col gap-2 group">
      <div
        className="relative w-full aspect-square overflow-hidden rounded-[var(--r3)] transition-all duration-200"
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border-bold)',
          cursor: imageUrl ? 'zoom-in' : 'default',
        }}
        onClick={() => imageUrl && onExpand({ src: imageUrl, alt: title })}
        onMouseEnter={e => {
          if (imageUrl) {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bold)';
        }}
      >
        {imageUrl ? (
          <>
            <ImageWithLoader src={imageUrl} alt={title} />

            {/* Zoom overlay on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <ZoomIn className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ScanSearch className="w-7 h-7 opacity-20" style={{ color: 'var(--t3)' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
              Bekleniyor
            </span>
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>{title}</h4>
        {description && (
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--t2)' }}>{description}</p>
        )}
      </div>
    </div>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
export function ImageLayersGrid({ originalImagePath, gradcamImagePath, elaImagePath, fftImagePath, onExpand }:
  { originalImagePath?: string; gradcamImagePath?: string; elaImagePath?: string; fftImagePath?: string; onExpand: (s: LightboxState) => void }) {

  const images = [originalImagePath, gradcamImagePath, elaImagePath, fftImagePath];

  return (
    <div className="card p-5 md:p-7">
      <SectionTitle icon={Fingerprint}>Yapay Zeka Görüntü Katmanları</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {LAYERS.map((l, i) => (
          <LayerCard
            key={l.key}
            title={l.title}
            imageUrl={images[i]}
            description={l.desc}
            onExpand={onExpand}
          />
        ))}
      </div>
    </div>
  );
}

