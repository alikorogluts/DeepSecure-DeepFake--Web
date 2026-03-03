'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Lightbox
 * Full-screen image viewer modal.
 * Closes on: backdrop click, Escape key, close button.
 */
export function Lightbox({ src, alt, onClose }: LightboxProps) {
  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Görsel büyütme: ${alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        aria-label="Kapat"
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
          (e.currentTarget as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
        }}
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image container — stopPropagation so clicking image doesn't close */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[88vh] p-6"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>

      {/* Caption */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs px-4 py-1.5 rounded-full"
        style={{
          color: 'rgba(255,255,255,0.4)',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}
      >
        {alt} · ESC tuşu ile kapat
      </p>
    </div>
  );
}
