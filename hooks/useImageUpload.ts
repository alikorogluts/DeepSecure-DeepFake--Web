import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AnalysisService } from '@/services/analysis.service';

export function useImageUpload(onUploadSuccess?: (id: string) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Dosya çok büyük! Maksimum 10MB yükleyebilirsiniz.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setProgress(0);
      setAnalysisId(null);
    }
  }, []);

  const removeFile = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setProgress(0);
    setAnalysisId(null); // ✅ Formu tamamen sıfırlar
  }, [preview]);

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await AnalysisService.upload(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? file.size));
        setProgress(percentCompleted);
      });

      const newId = response.analysisId;
      setAnalysisId(newId);

      if (onUploadSuccess) onUploadSuccess(newId);
      toast.success('Resim başarıyla yapay zekaya iletildi!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Yükleme sırasında bir hata oluştu.');
      removeFile(); // Hata olursa formu temizle
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    file,
    preview,
    isUploading,
    progress,
    analysisId,
    handleDrop,
    removeFile,
    uploadFile
  };
}