import type { Metadata } from 'next';
import './globals.css';
import AuthWrapper from '@/components/AuthWrapper';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TruvaLens | Deepfake Tespit Platformu',
  description:
    'Hibrit yapay zeka modelleriyle piksel düzeyinde deepfake analizi.',

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "'Outfit', system-ui, sans-serif" },
          }}
        />
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
