// ── ENUMS & STATUS TYPES ─────────────────────────────────────────────────────
// Backend'deki "Status" string alanını kısıtlayarak güvenli hale getiriyoruz.
export type AnalysisStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

// ── NESTED DTOs (İç içe objeler) ─────────────────────────────────────────────
export interface ExifAnalysisDto {
  hasMetadata: boolean;
  cameraInfo?: string;
  suspiciousIndicators: string[];
}

export interface AnalysisDetailDto {
  isDeepfake: boolean;
  cnnConfidence: number;
  elaScore?: number;
  fftAnomalyScore?: number;
  exifAnalysis: ExifAnalysisDto;
  originalImagePath?: string;
  gradcamImagePath?: string;
  elaImagePath?: string;
  fftImagePath?: string;
  processingTimeSeconds?: number;
  createdAt: string;
}

// ── RESPONSE DTOs (API'den dönen ana cevaplar) ───────────────────────────────

// 1. /api/v1/analyses/{id} (Polling / Detay getirme cevabı)
export interface AnalysisResultResponseDto {
  analysisId: string;
  status: AnalysisStatus;
  result?: AnalysisDetailDto; // C#'ta object? olarak tanımlı ama aslında bu dönecek
  message?: string;
  errorMessage?: string;
}

// 2. /api/v1/analyses (Geçmiş listesindeki tek bir eleman)
export interface HistoryItemDto {
  analysisId: string;
  isDeepfake: boolean;
  cnnConfidence: number;
  thumbnailPath?: string;
  createdAt: string;
}

// 3. /api/v1/analyses (Geçmiş listesi ana cevabı)
export interface PaginatedHistoryResponseDto {
  success: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  data: HistoryItemDto[];
}

// 4. /api/v1/analyses (Resim yükleme cevabı)
export interface UploadResponseDto {
  success: boolean;
  message: string;
  analysisId: string;
  originalImageUrl?: string;
  thumbnailUrl?: string;
  timestamp: string;
}