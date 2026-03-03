'use client';

import ImageUpload from '@/components/ImageUpload';
import AnalysisHistory from '@/components/AnalysisHistory';
import { StatusPanel } from '@/components/StatusPanel';
import Header from '@/components/home/Header';
import Navbar from '@/components/home/Navbar';
import BackgroundEffects from '@/components/home/BackgroundEffects';
import { useAnalysis } from '@/hooks/useAnalysis';

/** Home page — composes components, owns session state only */
export default function Home() {
  const { activeId, setActiveId, status, setStatus } = useAnalysis();

  return (
    <>
      <BackgroundEffects />
      <Navbar />

      <main className="flex flex-col items-center px-6 pb-24 md:px-12">
        <Header />

        <section className="w-full flex flex-col items-center gap-0 mb-6">
          <ImageUpload
            onUploadSuccess={id => { setActiveId(id); setStatus('Pending'); }}
          />
          {activeId && <StatusPanel status={status} id={activeId} />}
        </section>

        <div className="w-full max-w-5xl my-12" style={{ borderTop: '1px solid var(--border-dim)' }} />

        <section className="w-full max-w-5xl">
          <AnalysisHistory key={status === 'Completed' ? 'refresh' : 'static'} />
        </section>
      </main>
    </>
  );
}