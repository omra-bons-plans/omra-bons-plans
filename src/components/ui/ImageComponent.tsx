import React, { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  quality?: number;
  bucketName?: string;
}

export const ImageComponent = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  onClick,
  width,
  height,
  quality,
  bucketName = 'ad-images'
}: ImageComponentProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = getImageUrl(src, { width, height, quality }, bucketName);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

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

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onClick={onClick}
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ImageComponent;