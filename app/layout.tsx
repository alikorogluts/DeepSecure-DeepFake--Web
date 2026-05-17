import type { Metadata } from 'next';
import './globals.css';
import AuthWrapper from '@/components/AuthWrapper';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TruvaLens | Deepfake Tespit Platformu',
  description:
    'Hibrit yapay zeka modelleriyle piksel düzeyinde deepfake analizi.',

  icons: {
    icon: '/favicon.ico',
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