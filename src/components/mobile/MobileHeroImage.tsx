import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Composant Hero optimisé MOBILE UNIQUEMENT
 * - Image WebP dédiée mobile
 * - Dimensions fixes avec aspect-ratio pour CLS = 0
 * - Priority loading pour LCP optimal
 */
export const MobileHeroImage = () => {
  const isMobile = useIsMobile();

  // Desktop: utiliser l'image normale avec aspect-ratio fixe
  if (!isMobile) {
    return (
      <div 
        className="hero-media"
        style={{ 
          aspectRatio: '16/9', 
          minHeight: '600px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src="/hero-kaaba-new.webp"
          alt="Omra Bons Plans – La Kaaba sacrée à La Mecque"
          width="1600"
          height="900"
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
  }

  // MOBILE: Image optimisée avec dimensions fixes et aspect-ratio pour CLS = 0
  return (
    <div 
      className="hero-media" 
      style={{ 
        aspectRatio: '9/16', 
        minHeight: '100svh',
        maxHeight: '100svh',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <img
        src="/hero-kaaba-mobile-portrait.webp"
        alt="Omra Bons Plans – Séjours Omra et Hajj"
        width="576"
        height="1024"
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
