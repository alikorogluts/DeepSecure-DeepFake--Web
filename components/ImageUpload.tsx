'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, ScanSearch, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  onUploadSuccess: (id: string) => void;
}

// ── Dropzone (empty state) ────────────────────────────────────────────────────
function DropzoneEmpty({
  isDragActive,
  getRootProps,
  getInputProps,
}: {
  isDragActive: boolean;
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      {...getRootProps({
        className: 'flex flex-col items-center justify-center h-52 rounded-[var(--r3)] border-2 border-dashed cursor-pointer transition-colors duration-200 group',
        style: {
          borderColor: isDragActive ? 'var(--green)' : 'var(--border-bold)',
          background:  isDragActive ? 'var(--green-soft)' : 'var(--bg-raised)',
        },
      })}
    >
      <input {...getInputProps()} />
      <UploadCloud
        className="w-9 h-9 mb-3 transition-transform duration-150 group-hover:scale-105"
        style={{ color: isDragActive ? 'var(--green)' : 'var(--t3)' }}
      />
      <p className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>
        {isDragActive ? 'Dosyayı bırakın' : 'Görsel sürükleyin ya da seçin'}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--t3)' }}>JPG veya PNG · Maks. 10 MB</p>
    </motion.div>
  );
}

// ── File selected state ───────────────────────────────────────────────────────
function FileSelected({
  file, preview, isUploading, progress, analysisId, onRemove, onUpload,
}: {
  file: File; preview: string; isUploading: boolean; progress: number;
  analysisId: string | null; onRemove: () => void; onUpload: () => void;
}) {
  return (
    <motion.div
      key="selected"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-4"
    >
      {/* File row */}
      <div
        className="flex items-center gap-3 p-3 rounded-[var(--r2)]"
        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-dim)' }}
      >
        <div className="relative h-12 w-12 shrink-0 rounded-[var(--r1)] overflow-hidden"
          style={{ border: '1px solid var(--border-base)' }}>
          <Image src={preview} alt="Önizleme" fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--t1)' }}>{file.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        {!isUploading && (
          <button onClick={onRemove} className="p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--t3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--t3)')}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--t2)' }}>
              <Loader2 className="w-3 h-3 spin" style={{ color: 'var(--green)' }} />
              Yükleniyor
            </span>
            <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontWeight: 600 }}>%{progress}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-sunken)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              className="h-full rounded-full" style={{ background: 'var(--green)' }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      {!isUploading && (
        analysisId ? (
          <button onClick={onRemove}
            className="w-full py-2.5 rounded-[var(--r2)] text-sm font-semibold flex items-center justify-center gap-2 transition-opacity duration-150 hover:opacity-80"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', color: 'var(--t1)' }}>
            <RefreshCw className="w-4 h-4" style={{ color: 'var(--green)' }} />
            Yeni Görsel Yükle
          </button>
        ) : (
          <button onClick={onUpload}
            className="w-full py-2.5 rounded-[var(--r2)] text-sm font-semibold flex items-center justify-center gap-2 transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--green)', color: '#fff', boxShadow: 'var(--sh-green)' }}>
            <ScanSearch className="w-4 h-4" />
            Deepfake Analizini Başlat
          </button>
        )
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const { file, preview, isUploading, progress, analysisId, handleDrop, removeFile, uploadFile } =
    useImageUpload(onUploadSuccess);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
    maxFiles: 1,
    disabled: isUploading || !!analysisId,
  });

  return (
    <div
      className="w-full max-w-lg p-4 fade-up"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bold)',
        borderRadius: 'var(--r5)',
        boxShadow: 'var(--sh-raise)',
        animationDelay: '0.1s',
        animationFillMode: 'both',
      }}
    >
      <AnimatePresence mode="wait">
        {!file
          ? <DropzoneEmpty isDragActive={isDragActive} getRootProps={getRootProps} getInputProps={getInputProps} />
          : <FileSelected file={file} preview={preview!} isUploading={isUploading} progress={progress}
              analysisId={analysisId} onRemove={removeFile} onUpload={uploadFile} />
        }
      </AnimatePresence>
    </div>
  );
}