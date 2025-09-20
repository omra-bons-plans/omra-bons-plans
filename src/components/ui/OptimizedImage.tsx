import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Composant d'image optimisé avec lazy loading intelligent et formats modernes
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  sizes = '100vw',
  onLoad 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Générer des versions WebP et AVIF si possible
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('lovable-uploads')) {
      return originalSrc.replace('.png', '-optimized.webp').replace('.jpg', '-optimized.webp');
    }
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <picture>
      {/* Version WebP pour navigateurs modernes */}
      <source 
        srcSet={optimizedSrc}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Fallback image originale */}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        style={{
          backgroundColor: hasError ? '#f3f4f6' : 'transparent'
        }}
      />
      
      {/* Placeholder pendant le chargement */}
      {!isLoaded && !hasError && (
        <div 
          className={`absolute inset-0 bg-muted animate-pulse ${className}`}
          style={{ aspectRatio: 'inherit' }}
        />
      )}
    </picture>
  );
};

export default OptimizedImage;