import React, { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  bucketName?: string;
}

export const ImageComponent = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  onClick,
  bucketName = 'ad-images'
}: ImageComponentProps) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallbackSrc;
    return getImageUrl(src, undefined, bucketName);
  });

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ImageComponent;