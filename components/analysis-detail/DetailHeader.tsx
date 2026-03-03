'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2, Scan } from 'lucide-react';

/** Single responsibility: sticky top bar for the analysis detail page */
export function DetailHeader({ isDeepfake }: { isDeepfake: boolean }) {
  return (
    <header
      className="w-full"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: 'var(--sh-card)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between gap-4">

        {/* Left: brand + breadcrumb */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group" style={{ textDecoration: 'none' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'var(--green-soft)', border: '1px solid var(--border-accent)' }}
            >
              <Scan className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} />
            </div>
            <span className="text-sm font-bold hidden sm:block" style={{ color: 'var(--t1)' }}>
              Deep<span style={{ color: 'var(--green)' }}>Secure</span>
            </span>
          </Link>

          {/* Divider */}
          <div className="hidden sm:block h-4 w-px" style={{ background: 'var(--border-base)' }} />

          {/* Back link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
            style={{ color: 'var(--t2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--t2)')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Panele Dön
          </Link>

          <span style={{ color: 'var(--border-bold)' }}>/</span>
          <span className="text-xs hidden sm:block" style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
            Analiz Raporu
          </span>
        </div>

        {/* Right: verdict */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-[var(--r2)]"
          style={{
            background: isDeepfake ? 'var(--red-soft)' : 'var(--green-soft)',
            border: `1px solid ${isDeepfake ? 'rgba(248,113,113,0.25)' : 'var(--border-accent)'}`,
          }}
        >
          {isDeepfake
            ? <ShieldAlert className="w-4 h-4" style={{ color: 'var(--red)' }} />
            : <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green)' }} />
          }
          <div>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}>Nihai Karar</p>
            <p className="text-sm font-extrabold leading-tight"
              style={{ color: isDeepfake ? 'var(--red)' : 'var(--green)' }}>
              {isDeepfake ? 'DEEPFAKE TESPİT EDİLDİ' : 'GÖRSEL ORİJİNAL'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}