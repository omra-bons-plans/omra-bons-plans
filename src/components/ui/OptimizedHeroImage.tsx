interface OptimizedHeroImageProps {
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth?: number;
  desktopHeight?: number;
  className?: string;
}

export const OptimizedHeroImage = ({
  desktopWidth = 1280,
  desktopHeight = 720,
  className = ''
}: OptimizedHeroImageProps) => {
  return (
    <picture className={`absolute inset-0 w-full h-full ${className}`}>
      <source
        srcSet="/hero-kaaba-optimized.webp"
        type="image/webp"
        width={desktopWidth}
        height={desktopHeight}
      />
      <img
        src="/hero-kaaba-optimized.webp"
        alt="Comparateur Omra & Hajj 2026 - La Kaaba à La Mecque"
        className="absolute inset-0 w-full h-full object-cover"
        width={desktopWidth}
        height={desktopHeight}
        // @ts-expect-error React 18 doesn't have fetchPriority types yet
        fetchpriority="high"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
};
