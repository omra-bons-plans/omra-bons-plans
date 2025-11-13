import { useState, useEffect, useRef } from 'react';

interface LazyAgencyLogoProps {
  src: string;
  alt: string;
  agencyName: string;
  className?: string;
}

export const LazyAgencyLogo = ({ src, alt, agencyName, className = '' }: LazyAgencyLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

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
        rootMargin: '100px', // Charge 100px avant pour éviter le flash
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  // Tente de charger la version WebP si disponible, sinon fallback vers l'original
  const handleError = () => {
    if (imageSrc.endsWith('.webp')) {
      // Si WebP échoue, retour à l'original
      setImageSrc(src);
    }
  };

  // Essaie d'abord WebP si le fichier n'est pas déjà en WebP
  useEffect(() => {
    if (isVisible && !src.endsWith('.webp')) {
      const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
      // Teste si le WebP existe
      const img = new Image();
      img.onload = () => setImageSrc(webpSrc);
      img.onerror = () => setImageSrc(src);
      img.src = webpSrc;
    } else {
      setImageSrc(src);
    }
  }, [isVisible, src]);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse rounded" />
      )}
      {isVisible && (
        <img
          src={imageSrc}
          alt={alt}
          width="160"
          height="80"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '160px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};
