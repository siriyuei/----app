import { useMemo, useState, type ImgHTMLAttributes } from 'react';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

function encodeSvg(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createFallbackSvg(label: string) {
  const safeLabel = label.slice(0, 20) || 'Ink Realm';
  return encodeSvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1f2937"/>
          <stop offset="100%" stop-color="#4b5563"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        fill="#e5e7eb" font-size="42" font-family="Arial, sans-serif">${safeLabel}</text>
    </svg>`
  );
}

export function SmartImage({
  src,
  alt = 'image',
  fallbackLabel,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const fallbackSrc = useMemo(
    () => createFallbackSvg(fallbackLabel ?? alt ?? 'image'),
    [fallbackLabel, alt]
  );

  return (
    <img
      {...props}
      src={failed ? fallbackSrc : src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setFailed(true)}
    />
  );
}
