import React, { useState, useRef, useEffect } from 'react';

interface FastImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image optimisé pour un chargement rapide
 * - Lazy loading intelligent avec IntersectionObserver
 * - Preload pour les images prioritaires
 * - Fallback automatique en cas d'erreur
 * - Optimisation des performances
 */
const FastImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  fallbackSrc = '/ad-placeholder.jpg',
  onLoad,
  onError
}: FastImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Si prioritaire, charger immédiatement
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  const imgRef = useRef<HTMLImageElement>(null);

  // IntersectionObserver pour lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Précharger 50px avant d'être visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority, isInView]);

  // Preload pour les images prioritaires
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.onload = () => console.log('🚀 Image préchargée:', src);
      link.onerror = () => console.warn('⚠️ Échec préchargement:', src);
      document.head.appendChild(link);

      // Nettoyer après 5 secondes
      setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      }, 5000);
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn('❌ Erreur chargement image:', currentSrc);
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-muted/20 ${className}`}
    >
      {/* Image principale */}
      {(isInView || priority) && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Skeleton loader pendant le chargement */}
      {!isLoaded && (isInView || priority) && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse" />
      )}

      {/* Placeholder pour lazy loading */}
      {!isInView && !priority && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted/40 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default FastImage;