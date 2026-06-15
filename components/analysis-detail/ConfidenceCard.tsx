'use client';

import { Activity } from 'lucide-react';
import { GaugeChart } from '@/components/ui/GaugeChart';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  getAnalysisExplanation,
  getDisplayConfidenceLabel,
  getDisplayConfidenceValue,
} from '@/lib/analysis-display';

interface ConfidenceCardProps {
  cnnConfidence: number;
  isDeepfake: boolean;
  deepfakeProbability?: number | null;
  elaScore?: number | null;
  fftAnomalyScore?: number | null;
}

/** Single responsibility: CNN confidence gauge + ELA/FFT score bars */
export function ConfidenceCard({ cnnConfidence, isDeepfake, deepfakeProbability, elaScore, fftAnomalyScore }: ConfidenceCardProps) {
  const displayInput = { isDeepfake, deepfakeProbability, cnnConfidence };
  const pct = getDisplayConfidenceValue(displayInput);
  const confidenceLabel = getDisplayConfidenceLabel(displayInput);
  const explanation = getAnalysisExplanation(displayInput);

  return (
    <div className="card p-5">
      <SectionTitle icon={Activity}>Güvenilirlik Skorları</SectionTitle>

      <div className="flex justify-center mb-4">
        <GaugeChart value={pct} label={confidenceLabel} variant={isDeepfake ? 'danger' : 'success'} />
      </div>

      <p className="text-center text-xs px-3 py-2.5 rounded-[var(--r2)] mb-5"
        style={{ color: 'var(--t2)', background: 'var(--bg-raised)', border: '1px solid var(--border-dim)' }}>
        {explanation}
      </p>

      <div className="pt-4 space-y-5" style={{ borderTop: '1px solid var(--border-dim)' }}>
        {elaScore != null && (
          <ScoreBar label="ELA Anomali Skoru" value={elaScore} maxValue={5} fillColor="bg-amber-500"
            description="Görselin farklı bölgelerindeki JPEG sıkıştırma hatalarını ölçer."
            lowNote="Sıkıştırma izleri tutarlı. Görsel düzenlenmemiş görünüyor."
            highNote="Farklı sıkıştırma seviyeleri var. Bazı bölgeler sonradan eklenmiş olabilir." />
        )}
        {fftAnomalyScore != null && (
          <ScoreBar label="Frekans Anomalisi (FFT)" value={fftAnomalyScore} maxValue={1} fillColor="bg-violet-500"
            description="Görseli frekans uzayına taşır. AI üretim araçları periyodik ızgara desenleri bırakır."
            lowNote="Frekans dağılımı doğal. AI üretim izi görülmüyor."
            highNote="Anormal periyodik desenler bulundu. Midjourney veya Stable Diffusion gibi bir araçla üretilmiş olabilir." />
        )}
      </div>
    </div>
  );
}
