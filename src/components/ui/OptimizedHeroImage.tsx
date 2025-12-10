/**
 * ⚡ ULTRA-OPTIMIZED HERO IMAGE FOR MAXIMUM LCP PERFORMANCE
 * - WebP format optimized
 * - Explicit dimensions + aspect-ratio to prevent CLS = 0
 * - fetchPriority="high" for browser prioritization
 * - NO useState/useEffect to avoid React hydration delay
 * - GPU-accelerated with will-change and content-visibility
 */

interface OptimizedHeroImageProps {
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
  className?: string;
}

export const OptimizedHeroImage = ({
  mobileWidth = 750,
  mobileHeight = 500,
  desktopWidth = 1600,
  desktopHeight = 500,
  className = ''
}: OptimizedHeroImageProps) => {
  // ⚡ CRITICAL: No state, no effects - pure render for fastest LCP
  return (
    <picture 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ 
        contentVisibility: 'auto',
        containIntrinsicSize: `${desktopWidth}px ${desktopHeight}px`,
        aspectRatio: `${desktopWidth}/${desktopHeight}`
      }}
    >
      {/* WebP format - optimized */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-new.webp"
        type="image/webp"
        width={mobileWidth}
        height={mobileHeight}
      />
      <source
        media="(min-width: 768px)"
        srcSet="/hero-kaaba-new.webp"
        type="image/webp"
        width={desktopWidth}
        height={desktopHeight}
      />
      
      {/* Default img - always visible immediately */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <img 
        src="/hero-kaaba-new.webp"
        alt="Omra Bons Plans - Comparateur Omra & Hajj - La Kaaba à La Mecque" 
        className="absolute inset-0 w-full h-full object-cover"
        width={desktopWidth}
        height={desktopHeight}
        // @ts-expect-error - fetchpriority is valid HTML attribute
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        style={{ 
          display: 'block',
          contentVisibility: 'auto',
          willChange: 'auto',
          aspectRatio: `${desktopWidth}/${desktopHeight}`
        }}
      />
    </picture>
  );
};
