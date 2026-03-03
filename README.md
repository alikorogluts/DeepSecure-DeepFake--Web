# DeepSecure — Frontend

Deepfake tespit platformunun Next.js 14 tabanlı kullanıcı arayüzü.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS + CSS Custom Properties |
| Animasyon | Framer Motion |
| İkonlar | Lucide React |
| Bildirimler | Sonner |
| Görsel yükleme | react-dropzone |
| HTTP | Axios |

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build && npm start
```

Ortam değişkenleri için `.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx                   # Root layout — font, toaster, auth guard
│   ├── page.tsx                     # Ana sayfa (upload + geçmiş)
│   └── analysis/
│       └── [id]/
│           └── page.tsx             # Analiz detay sayfası
│
├── components/
│   ├── AuthWrapper.tsx              # Session guard
│   ├── ImageUpload.tsx              # Dosya sürükle/bırak + yükleme
│   ├── StatusPanel.tsx              # Analiz durumu göstergesi
│   ├── AnalysisHistory.tsx          # Geçmiş analizler listesi
│   │
│   ├── home/
│   │   ├── Navbar.tsx               # Üst navigasyon
│   │   ├── Header.tsx               # Hero başlık
│   │   └── BackgroundEffects.tsx    # Dekoratif arka plan
│   │
│   ├── analysis-detail/
│   │   ├── DetailHeader.tsx         # Sticky breadcrumb + karar badge
│   │   ├── ConfidenceCard.tsx       # CNN gauge + ELA/FFT çubukları
│   │   ├── ExifCard.tsx             # EXIF metadata bulguları
│   │   └── ImageLayersGrid.tsx      # 2×2 AI görüntü katmanları
│   │
│   └── ui/
│       ├── GaugeChart.tsx           # SVG radial gauge
│       ├── ScoreBar.tsx             # Yatay skor çubuğu
│       ├── SectionTitle.tsx         # Kart başlık atom
│       └── Lightbox.tsx             # Tam ekran görsel görüntüleyici
│
├── hooks/
│   ├── useAuth.ts                   # Auth state yönetimi
│   ├── useImageUpload.ts            # Dosya seçme + upload mantığı
│   ├── useAnalysis.ts               # Aktif analiz state
│   └── useAnalysisHistory.ts        # Geçmiş analizleri çekme
│
├── services/
│   └── analysis.service.ts          # API çağrıları
│
├── types/
│   └── analysis.types.ts            # TypeScript tip tanımları
│
└── app/
    └── globals.css                  # Design token sistemi
```

---

## Design Token Sistemi

Tüm renkler, boşluklar ve gölgeler `globals.css`'deki CSS custom property'ler üzerinden yönetilir. Light/dark mode `@media (prefers-color-scheme)` ile otomatik çalışır — JavaScript gerekmez.

### Renk Token'ları

```css
/* Arka plan katmanları */
--bg-page      /* Sayfa arka planı */
--bg-card      /* Kart yüzeyi */
--bg-raised    /* Kart içi yükseltilmiş alan */
--bg-sunken    /* Çukur / inset alan */

/* Sınırlar */
--border-dim     /* Çok hafif ayraç */
--border-base    /* Standart kart sınırı */
--border-bold    /* Vurgulu sınır */
--border-accent  /* Yeşil accent sınırı */

/* Metin */
--t1   /* Başlık / vurgu */
--t2   /* Gövde / ikincil */
--t3   /* İpucu / devre dışı */

/* Semantik renkler */
--green / --green-soft
--red   / --red-soft
--yellow / --yellow-soft
--blue  / --blue-soft
```

### Radius Token'ları

```css
--r1: 6px    /* Buton içi eleman */
--r2: 10px   /* Küçük kart/pill */
--r3: 16px   /* Orta kart */
--r4: 22px   /* Ana kart */
--r5: 30px   /* Upload alanı */
```

---

## Mimari Prensipler

### Single Responsibility
Her bileşen tek bir iş yapar:

| Bileşen | Sorumluluk |
|---|---|
| `ImageUpload` | Dosya seçme ve yükleme |
| `StatusPanel` | Durum gösterimi |
| `GaugeChart` | Sadece radial gauge render |
| `ScoreBar` | Sadece bar render |
| `Lightbox` | Sadece fullscreen görsel |
| `page.tsx` | State birleştirme ve layout |

### Atomic Design
```
atoms       → GaugeChart, ScoreBar, SectionTitle, Lightbox
molecules   → ConfidenceCard, ExifCard, ImageLayersGrid, StatusPanel
organisms   → AnalysisHistory, ImageUpload
templates   → DetailHeader + layout composition
pages       → page.tsx (sadece state + composition)
```

### CSS Token Katmanı
Bileşenler hard-coded renk kullanmaz. Tüm renkler `var(--token)` üzerinden gelir — bu sayede dark/light mod otomatik çalışır ve tema değişikliği tek dosyadan yapılabilir.

---

## Sayfalar

### `/` — Ana Sayfa
Kullanıcının görsel yükleyebildiği ve geçmiş analizlerini gördüğü ana ekran.

**Akış:**
1. Kullanıcı görsel seçer veya sürükler
2. `ImageUpload` → `useImageUpload` hook → `AnalysisService.upload()`
3. Upload tamamlanınca `onUploadSuccess(id)` tetiklenir
4. `StatusPanel` analiz durumunu polling ile takip eder
5. `Completed` durumunda `AnalysisHistory` yenilenir

### `/analysis/[id]` — Analiz Detayı
Belirli bir analizin tüm bulgularını gösteren rapor sayfası.

**Bileşimler:**
- `DetailHeader` — breadcrumb + final verdict
- `ConfidenceCard` — CNN skoru, ELA, FFT
- `ExifCard` — metadata bulguları
- `ImageLayersGrid` — 4 AI katman görseli

---

## API Entegrasyonu

`src/services/analysis.service.ts` dosyası backend ile iletişimi yönetir:

```typescript
// Görsel yükleme
AnalysisService.upload(formData, onProgress)
  → Promise<{ analysisId: string }>

// Analiz durumu
AnalysisService.getStatus(id)
  → Promise<{ status: AnalysisStatus }>

// Analiz sonucu
AnalysisService.getDetail(id)
  → Promise<AnalysisDetailDto>

// Geçmiş listesi
AnalysisService.getHistory()
  → Promise<HistoryItemDto[]>
```

### Tipler

```typescript
type AnalysisStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

interface HistoryItemDto {
  analysisId: string;
  createdAt: string;
  isDeepfake: boolean;
  cnnConfidence: number;
  thumbnailPath: string;
}

interface AnalysisDetailDto {
  analysisId: string;
  isDeepfake: boolean;
  cnnConfidence: number;
  elaScore: number | null;
  fftAnomalyScore: number | null;
  originalImagePath: string;
  gradcamImagePath: string;
  elaImagePath: string;
  fftImagePath: string;
  exifAnalysis: ExifAnalysis;
}
```

---

## Light / Dark Mode

Sistem tercihi otomatik algılanır (`prefers-color-scheme`). Kullanıcı toggle'ına gerek yoktur.

| Mod | Arka Plan | Kart | Metin |
|---|---|---|---|
| Dark | `#0a0a0a` | `#111111` | `#ededed` |
| Light | `#eef0f5` | `#ffffff` | `#0e1117` |

---

## Katkı

1. `main` branch'ten yeni branch aç: `git checkout -b feat/özellik-adı`
2. Değişiklikleri yap
3. `npm run build` ile hata kontrolü yap
4. PR aç — açıklamada değişikliğin amacını belirt