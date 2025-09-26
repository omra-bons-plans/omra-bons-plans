import React, { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface UniversalImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  optimize?: { width?: number; height?: number; quality?: number };
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image universel qui gère automatiquement :
 * - La détection du bucket (blog-images, ad-images, etc.)
 * - L'optimisation des images Supabase
 * - Les fallbacks en cas d'erreur
 * - Le lazy loading
 */
export const UniversalImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  optimize = { width: 800, quality: 85 },
  loading = 'lazy',
  onLoad,
  onError
}: UniversalImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallbackSrc;
    
    // Détection automatique du bucket
    let bucketName = 'ad-images'; // défaut
    
    if (typeof src === 'string') {
      if (src.includes('blog-images') || src.includes('/blog/')) {
        bucketName = 'blog-images';
      } else if (src.includes('ad-images') || src.includes('/ads/')) {
        bucketName = 'ad-images';  
      }
    }
    
    return getImageUrl(src, optimize, bucketName);
  });

  const handleError = () => {
    console.error('❌ Erreur de chargement d\'image:', currentSrc);
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ Image chargée avec succès:', currentSrc);
    onLoad?.();
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
    />
  );
};

export default UniversalImage;