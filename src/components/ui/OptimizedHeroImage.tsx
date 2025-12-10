/**
 * ⚡ ULTRA-OPTIMIZED HERO IMAGE FOR MAXIMUM LCP PERFORMANCE
 * - AVIF format with JPG fallback
 * - Explicit dimensions to prevent CLS
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
        containIntrinsicSize: `${desktopWidth}px ${desktopHeight}px`
      }}
    >
      {/* AVIF format - smallest file size, best compression */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-2025-optimized.avif"
        type="image/avif"
        width={mobileWidth}
        height={mobileHeight}
      />
      <source
        media="(min-width: 768px)"
        srcSet="/hero-kaaba-2025-optimized.avif"
        type="image/avif"
        width={desktopWidth}
        height={desktopHeight}
      />
      
      {/* JPG fallback for older browsers */}
      <source
        media="(max-width: 767px)"
        srcSet="/hero-kaaba-2025-new.jpg"
        type="image/jpeg"
        width={mobileWidth}
        height={mobileHeight}
      />
      
      {/* Default img - always visible immediately */}
      <img 
        src="/hero-kaaba-2025-new.jpg" 
        alt="Omra Bons Plans - Comparateur Omra & Hajj - La Kaaba à La Mecque" 
        className="absolute inset-0 w-full h-full object-cover"
        width={desktopWidth}
        height={desktopHeight}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        style={{ 
          display: 'block',
          contentVisibility: 'auto',
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      />
    </picture>
  );
};
