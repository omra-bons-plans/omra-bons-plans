import { useState, useEffect } from 'react';

interface OptimizedHeroImageProps {
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
}

export const OptimizedHeroImage = ({
  mobileWidth = 750,
  mobileHeight = 400,
  desktopWidth = 1600,
  desktopHeight = 500,
}: OptimizedHeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <picture className="absolute inset-0 w-full h-full">
      {/* Mobile: Image optimisée */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-2025-new.jpg"
        type="image/jpeg"
        width={mobileWidth}
        height={mobileHeight}
      />
      
      {/* Desktop fallback */}
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
        style={{ display: 'block' }}
      />
      
      {/* Skeleton loader pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      )}
    </picture>
  );
};
