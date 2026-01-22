import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Composant Hero optimisé - Image compressée unique pour tous les appareils
 * - Image WebP compressée format paysage
 * - Dimensions fixes avec aspect-ratio pour CLS = 0
 * - Priority loading pour LCP optimal
 */
export const MobileHeroImage = () => {
  const isMobile = useIsMobile();

  return (
    <div 
      className="hero-media"
      style={{ 
        aspectRatio: '16/9', 
        minHeight: isMobile ? '50vh' : '600px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <img
        src="/hero-kaaba-compressed.webp"
        alt="Omra Bons Plans – La Kaaba sacrée à La Mecque"
        width={1024}
        height={576}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          position: 'absolute',
          inset: 0
        }}
      />
    </div>
  );
};
