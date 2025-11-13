import { useState, useEffect } from 'react';

interface OptimizedHeroImageProps {
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
}

export const OptimizedHeroImage = ({
  mobileWidth = 750,
  mobileHeight = 1334,
  desktopWidth = 1920,
  desktopHeight = 1080,
}: OptimizedHeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <picture className="absolute inset-0 w-full h-full">
      {/* AVIF format - le plus léger (support moderne) */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-2025-new.avif"
        type="image/avif"
        width={mobileWidth}
        height={mobileHeight}
      />
      <source
        media="(min-width: 768px)"
        srcSet="/hero-kaaba-2025-new.avif"
        type="image/avif"
        width={desktopWidth}
        height={desktopHeight}
      />
      
      {/* WebP format - fallback pour navigateurs sans AVIF */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-2025-new.webp"
        type="image/webp"
        width={mobileWidth}
        height={mobileHeight}
      />
      <source
        media="(min-width: 768px)"
        srcSet="/hero-kaaba-2025-new.webp"
        type="image/webp"
        width={desktopWidth}
        height={desktopHeight}
      />
      
      {/* JPG fallback - support universel */}
      <img 
        src="/hero-kaaba-2025-new.jpg" 
        alt="Comparateur Omra - La Kaaba à La Mecque" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        width={desktopWidth}
        height={desktopHeight}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        style={{ 
          display: 'block',
          contentVisibility: 'auto',
        }}
      />
      
      {/* Skeleton loader pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      )}
    </picture>
  );
};
