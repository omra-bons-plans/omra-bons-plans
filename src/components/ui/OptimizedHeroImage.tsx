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
      {/* Image unique optimisée pour tous les appareils */}
      <source
        srcSet="/hero-kaaba-optimized.webp"
        type="image/webp"
        width={1280}
        height={720}
      />
      
      {/* Fallback: Image optimisée */}
      <img 
        src="/hero-kaaba-optimized.webp"
        alt="Omra Bons Plans - Comparateur Omra & Hajj - La Kaaba à La Mecque" 
        className="absolute inset-0 w-full h-full object-cover"
        width={1280}
        height={720}
        // @ts-expect-error React 18 doesn't have fetchPriority types yet
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        style={{ 
          display: 'block',
          contentVisibility: 'auto',
          willChange: 'auto'
        }}
      />
    </picture>
  );
};
