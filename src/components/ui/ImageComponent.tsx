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

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      decoding="async"
      onClick={onClick}
    />
  );
};

export default ImageComponent;