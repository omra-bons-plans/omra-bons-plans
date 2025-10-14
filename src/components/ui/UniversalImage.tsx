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
  responsive?: boolean;
  sizes?: string;
}

/**
 * Composant d'image universel qui gère automatiquement :
 * - La détection du bucket (blog-images, ad-images, etc.)
 * - L'optimisation des images Supabase
 * - Les images responsives avec srcset
 * - Les fallbacks en cas d'erreur
 * - Le lazy loading
 */
export const UniversalImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  optimize,
  loading = 'lazy',
  onLoad,
  onError,
  responsive = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: UniversalImageProps) => {
  const [hasError, setHasError] = useState(false);

  // Détection automatique du bucket
  const detectBucket = (imagePath: string | null | undefined): string => {
    if (!imagePath || typeof imagePath !== 'string') return 'ad-images';
    
    if (imagePath.startsWith('blog/') || imagePath.includes('/blog/')) {
      return 'blog-images';
    } else if (imagePath.includes('blog-images')) {
      return 'blog-images';
    } else if (imagePath.includes('ad-images') || imagePath.includes('/ads/')) {
      return 'ad-images';  
    }
    
    return 'ad-images';
  };

  const bucketName = detectBucket(src);
  
  // Generate srcset for responsive images
  const generateSrcSet = (imagePath: string) => {
    if (!responsive || !imagePath || imagePath.startsWith('http')) {
      return undefined;
    }
    
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => {
        const url = getImageUrl(imagePath, { width, quality: 80 }, bucketName);
        return `${url} ${width}w`;
      })
      .join(', ');
  };

  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallbackSrc;
    
    // Si c'est déjà une URL complète, la retourner directement
    if (typeof src === 'string' && src.startsWith('http')) {
      return src;
    }
    
    // Optimiser selon les paramètres fournis ou utiliser des valeurs par défaut pour mobile
    const optimizeParams = optimize || (responsive ? { width: 640, quality: 80 } : undefined);
    return getImageUrl(src, optimizeParams, bucketName);
  });

  const [srcSet, setSrcSet] = useState(() => {
    if (!src) return undefined;
    return generateSrcSet(src);
  });

  const handleError = () => {
    console.error('❌ Erreur de chargement d\'image:', currentSrc);
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setSrcSet(undefined);
    }
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ Image chargée avec succès:', currentSrc);
    onLoad?.();
  };

  // Extraire width/height du className si présents
  const dimensions = React.useMemo(() => {
    const widthMatch = className?.match(/w-\[(\d+)px\]/);
    const heightMatch = className?.match(/h-\[(\d+)px\]/);
    return {
      width: widthMatch ? widthMatch[1] : undefined,
      height: heightMatch ? heightMatch[1] : undefined
    };
  }, [className]);

  return (
    <img
      src={currentSrc}
      srcSet={srcSet}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
      width={dimensions.width}
      height={dimensions.height}
    />
  );
};

export default UniversalImage;