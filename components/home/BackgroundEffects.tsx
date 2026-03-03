'use client';

/**
 * BackgroundEffects — purely decorative, zero logic.
 * Adapts to light/dark mode via CSS custom properties.
 * All colors use var(--green-soft) so they work in both modes.
 */
export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top-center glow */}
      <div
        className="absolute -top-64 left-1/2 -translate-x-1/2 w-[800px] h-[500px] breathe"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, var(--green-soft) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Bottom-right accent */}
      <div
        className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--green-soft) 0%, transparent 70%)',
          filter: 'blur(72px)',
          opacity: 0.5,
        }}
      />
    </div>
  );
}