import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useLang } from '../../app/providers/LanguageProvider';

export default function ArtworkImage({ src, title, className = '' }: { src: string; title: string; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const { lang } = useLang();
  if (failedSource === src) {
    const label = lang === 'en' ? 'Image unavailable' : lang === 'kg' ? 'Сүрөт жеткиликсиз' : 'Изображение недоступно';
    return <div className={`heritage-art-placeholder ${className}`} role="img" aria-label={`${title}: ${label}`}><ImageOff size={24} strokeWidth={1} aria-hidden="true" /></div>;
  }
  return <img src={src} alt={title} className={className} loading="lazy" onError={() => setFailedSource(src)} />;
}
