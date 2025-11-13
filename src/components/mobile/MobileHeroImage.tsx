import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Composant Hero optimisé MOBILE UNIQUEMENT
 * - Image AVIF dédiée mobile < 150KB
 * - Dimensions fixes pour CLS = 0
 * - Priority loading pour LCP optimal
 */
export const MobileHeroImage = () => {
  const isMobile = useIsMobile();

  // Desktop: utiliser les formats modernes avec fallback
  if (!isMobile) {
    return (
      <div className="hero-media">
        <picture>
          <source srcSet="/hero-kaaba-2025-new.avif" type="image/avif" />
          <source srcSet="/hero-kaaba-2025-new.webp" type="image/webp" />
          <img
            src="/hero-kaaba-2025-new.jpg"
            alt="Omra Bons Plans – La Kaaba sacrée à La Mecque"
            width="1600"
            height="900"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
    );
  }

  // MOBILE: Image optimisée avec formats modernes
  return (
    <div className="hero-media" style={{ aspectRatio: '16/9', minHeight: '100vh' }}>
      <picture style={{ width: '100%', height: '100%' }}>
        <source srcSet="/hero-kaaba-2025-new.avif" type="image/avif" />
        <source srcSet="/hero-kaaba-2025-new.webp" type="image/webp" />
        <img
          src="/hero-kaaba-2025-new.jpg"
          alt="Omra Bons Plans – Séjours Omra et Hajj"
          width="750"
          height="1334"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </picture>
    </div>
  );
};
