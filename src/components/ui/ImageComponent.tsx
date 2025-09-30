import React, { useState } from 'react';
import { optimizeSupabaseImage } from '@/utils/imageUtils';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  quality?: number;
}

export const ImageComponent = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  onClick,
  width = 800,
  height,
  quality = 70
}: ImageComponentProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        onClick={onClick}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // URLs optimisées pour différents formats
  const avifUrl = optimizeSupabaseImage(src, { width, height, quality, format: 'avif' });
  const webpUrl = optimizeSupabaseImage(src, { width, height, quality, format: 'webp' });
  const jpegUrl = optimizeSupabaseImage(src, { width, height, quality, format: 'jpeg' });

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <picture className={className} onClick={onClick}>
      {/* AVIF - Meilleure compression */}
      <source type="image/avif" srcSet={avifUrl} />
      
      {/* WebP - Fallback moderne */}
      <source type="image/webp" srcSet={webpUrl} />
      
      {/* JPEG - Fallback universel */}
      <img
        src={jpegUrl}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};

export default ImageComponent;