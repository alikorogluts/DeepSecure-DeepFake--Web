import { Camera, ShieldAlert } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface ExifAnalysis {
  hasMetadata: boolean;
  cameraInfo?: string | null;
  suspiciousIndicators?: string[];
}

/** Single responsibility: display EXIF metadata findings */
export function ExifCard({ exifAnalysis }: { exifAnalysis: ExifAnalysis }) {
  return (
    <div className="card p-5">
      <SectionTitle icon={Camera}>Meta Veri (EXIF)</SectionTitle>

      {exifAnalysis.hasMetadata ? (
        <div className="space-y-3">
          <div className="p-3 rounded-[var(--r2)]"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-dim)' }}>
            <p className="text-[11px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}>
              Cihaz / Yazılım
            </p>
            <p className="text-sm" style={{ color: 'var(--t1)' }}>
              {exifAnalysis.cameraInfo || 'Bilinmeyen Kaynak'}
            </p>
          </div>

          {exifAnalysis.suspiciousIndicators && exifAnalysis.suspiciousIndicators.length > 0 && (
            <div className="p-3.5 rounded-[var(--r2)]"
              style={{ background: 'var(--red-soft)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <ShieldAlert className="w-3.5 h-3.5" style={{ color: 'var(--red)' }} />
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--red)', fontFamily: 'var(--mono)' }}>
                  Şüpheli Bulgular
                </span>
              </div>
              <ul className="space-y-1.5">
                {exifAnalysis.suspiciousIndicators.map((ind, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--red)' }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--red)' }} />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-[var(--r2)]"
          style={{ background: 'var(--yellow-soft)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--yellow)' }}>
            Bu görselde EXIF meta verisi bulunamadı. Sosyal medyadan indirilmiş ya da kasıtlı olarak silinmiş olabilir.
          </p>
        </div>
      )}
    </div>
  );
}