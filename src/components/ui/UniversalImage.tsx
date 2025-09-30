import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface UniversalImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  optimize?: { width?: number; height?: number; quality?: number };
  loading?: 'lazy' | 'eager';
  priority?: boolean; // Pour preload des images critiques
  sizes?: string; // Pour responsive images
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image next-gen avec support AVIF/WebP/JPEG et optimisations avancées
 * - Format moderne: AVIF > WebP > JPEG
 * - Lazy loading intelligent avec Intersection Observer
 * - Preloading automatique des images critiques
 * - Placeholder blur progressif
 * - Responsive images selon taille écran
 */
export const UniversalImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  optimize = { width: 800, quality: 70 },
  loading = 'lazy',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError
}: UniversalImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLPictureElement>(null);

  // Détection automatique du bucket
  const bucketName = React.useMemo(() => {
    if (!src || typeof src !== 'string') return 'ad-images';
    if (src.includes('blog-images') || src.includes('/blog/')) return 'blog-images';
    return 'ad-images';
  }, [src]);

  // URLs optimisées pour différents formats
  const imageUrls = React.useMemo(() => {
    if (!src) return { avif: fallbackSrc, webp: fallbackSrc, jpeg: fallbackSrc };
    
    const baseUrl = getImageUrl(src, optimize, bucketName);
    
    return {
      avif: baseUrl.replace(/format=(webp|jpeg)/, 'format=avif'),
      webp: baseUrl.replace(/format=(avif|jpeg)/, 'format=webp'),
      jpeg: baseUrl.replace(/format=(avif|webp)/, 'format=jpeg')
    };
  }, [src, optimize, bucketName, fallbackSrc]);

  // Lazy loading avec Intersection Observer
  useEffect(() => {
    if (priority || loading === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Charger 50px avant d'être visible
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Preload des images critiques
  useEffect(() => {
    if (priority && isVisible) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrls.avif;
      link.imageSrcset = imageUrls.avif;
      link.imageSizes = sizes;
      link.fetchPriority = 'high';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, isVisible, imageUrls.avif, sizes]);

  const handleError = () => {
    console.error('❌ Erreur de chargement:', imageUrls);
    if (!hasError) {
      setHasError(true);
    }
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ Image chargée:', imageUrls.avif);
    setIsLoaded(true);
    onLoad?.();
  };

  // Ne pas charger l'image tant qu'elle n'est pas visible
  if (!isVisible) {
    return (
      <picture ref={imgRef} className={className}>
        <div 
          className="bg-muted animate-pulse" 
          style={{ aspectRatio: '16/9' }}
          aria-label="Chargement de l'image..."
        />
      </picture>
    );
  }

  return (
    <picture ref={imgRef} className={className}>
      {/* AVIF - Meilleure compression (50% plus léger que WebP) */}
      <source 
        type="image/avif" 
        srcSet={imageUrls.avif}
        sizes={sizes}
      />
      
      {/* WebP - Fallback moderne */}
      <source 
        type="image/webp" 
        srcSet={imageUrls.webp}
        sizes={sizes}
      />
      
      {/* JPEG - Fallback universel */}
      <img
        src={hasError ? fallbackSrc : imageUrls.jpeg}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={loading}
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        sizes={sizes}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
};

export default UniversalImage;