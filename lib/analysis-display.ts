export interface AnalysisDisplayInput {
  isDeepfake: boolean;
  deepfakeProbability?: number | null;
  cnnConfidence?: number | null;
}

const ANALYSIS_NOTE =
  'Bu sonuç kesin kanıt değildir; model tahminidir. Görsel kalitesi, sıkıştırma, ışık ve yüz görünürlüğü sonucu etkileyebilir.';

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function toPercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) return 0;
  return clampPercent(value <= 1 ? value * 100 : value);
}

function getDeepfakeProbability(input: AnalysisDisplayInput) {
  if (input.deepfakeProbability != null) {
    return clampPercent(input.deepfakeProbability);
  }

  return toPercent(input.cnnConfidence);
}

export function getDisplayResultLabel(input: AnalysisDisplayInput) {
  return input.isDeepfake ? 'DEEPFAKE' : 'GERÇEK';
}

export function getDisplayConfidenceLabel(input: AnalysisDisplayInput) {
  return input.isDeepfake ? 'DEEPFAKE OLASILIĞI' : 'GERÇEKLİK GÜVENİ';
}

export function getDisplayConfidenceValue(input: AnalysisDisplayInput) {
  const deepfakeProbability = getDeepfakeProbability(input);
  const value = input.isDeepfake ? deepfakeProbability : 100 - deepfakeProbability;
  return Math.round(clampPercent(value));
}

export function getAnalysisExplanation(input: AnalysisDisplayInput) {
  const mainText = input.isDeepfake
    ? 'Model bu görselde yapay zeka üretimi veya manipülasyon izleri tespit etti. Bu nedenle sonuç DEEPFAKE olarak işaretlendi. Gösterilen oran, modelin deepfake tahminine olan güven seviyesini ifade eder.'
    : 'Model bu görselin yapay zeka ile üretilmiş veya manipüle edilmiş olma ihtimalini düşük değerlendirdi. Bu nedenle sonuç GERÇEK olarak işaretlendi. Gösterilen oran, modelin görseli gerçek olarak sınıflandırırken sahip olduğu güven seviyesini ifade eder.';

  return `${mainText} ${ANALYSIS_NOTE}`;
}
