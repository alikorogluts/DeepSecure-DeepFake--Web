'use client';

import { ShieldCheck } from 'lucide-react';

const FEATURES = ['CNN + ELA Analizi', 'Grad-CAM Isı Haritası', 'EXIF Metadata'];

/** Single responsibility: hero heading for the home page */
export default function Header() {
  return (
    <header
      className="text-center mb-10 pt-2 fade-up"
      style={{ animationDelay: '0.06s', animationFillMode: 'both' }}
    >
      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 uppercase tracking-wider"
        style={{
          background: 'var(--green-soft)',
          border: '1px solid var(--border-accent)',
          color: 'var(--green)',
        }}
      >
        <ShieldCheck className="w-3 h-3" />
        Yapay Zeka Laboratuvarı
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 heading-gradient" style={{ letterSpacing: '-0.03em' }}>
        Deepfake Analiz<br />Platformu
      </h1>

      {/* Subtitle */}
      <p className="text-base max-w-sm mx-auto mb-7" style={{ color: 'var(--t2)', lineHeight: '1.7' }}>
        Görsellerinizi yükleyin, hibrit AI modellerimiz piksel düzeyinde analiz etsin.
      </p>

      {/* Feature list */}
      <div className="flex items-center justify-center flex-wrap gap-4 text-xs" style={{ color: 'var(--t3)' }}>
        {FEATURES.map(f => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--green)' }} />
            <span style={{ color: 'var(--t2)' }}>{f}</span>
          </span>
        ))}
      </div>
    </header>
  );
}