'use client';

import Link from 'next/link';
import { Scan } from 'lucide-react';

/** Single responsibility: site navigation bar */
export default function Navbar() {
  return (
    <nav className="w-full fade-up" style={{ animationFillMode: 'both' }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand mark */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'var(--green-soft)', border: '1px solid var(--border-accent)' }}
          >
            <Scan className="w-4 h-4" style={{ color: 'var(--green)' }} />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--t1)', fontFamily: 'var(--sans)' }}>
            Deep<span style={{ color: 'var(--green)' }}>Secure</span>
          </span>
        </Link>

        {/* Live status indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            color: 'var(--t3)',
            fontFamily: 'var(--mono)',
            boxShadow: 'var(--sh-card)',
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: 'var(--green)' }} />
            <span className="relative rounded-full h-1.5 w-1.5" style={{ background: 'var(--green)' }} />
          </span>
          Sistem Aktif
        </div>
      </div>
    </nav>
  );
}