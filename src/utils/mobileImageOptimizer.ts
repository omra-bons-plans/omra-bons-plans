/**
 * Utilitaires d'optimisation d'images MOBILE uniquement
 * Budget mobile: images above-fold ≤ 200KB total
 */

/**
 * Retourne l'URL optimisée pour mobile (AVIF, dimensions réduites)
 */
export const getMobileOptimizedImageUrl = (
  originalUrl: string,
  width: number = 360,
  quality: number = 80
): string => {
  // Si c'est déjà une image optimisée, la retourner telle quelle
  if (originalUrl.includes('optimized') || originalUrl.endsWith('.avif')) {
    return originalUrl;
  }

  // Pour les images Supabase, ajouter les paramètres d'optimisation
  if (originalUrl.includes('supabase')) {
    const url = new URL(originalUrl);
    url.searchParams.set('width', width.toString());
    url.searchParams.set('quality', quality.toString());
    url.searchParams.set('format', 'avif');
    return url.toString();
  }

  return originalUrl;
};

/**
 * Génère un srcset optimisé pour mobile
 */
export const generateMobileSrcSet = (
  baseUrl: string,
  sizes: number[] = [360, 420, 640]
): string => {
  return sizes
    .map(size => `${getMobileOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

/**
 * Tailles recommandées pour mobile
 */
export const MOBILE_IMAGE_SIZES = {
  hero: { width: 750, height: 1334, maxSize: 150 }, // < 150KB
  card: { width: 360, height: 220, maxSize: 80 },   // < 80KB
  thumbnail: { width: 120, height: 120, maxSize: 30 }, // < 30KB
  icon: { width: 64, height: 64, maxSize: 10 },     // < 10KB
};

/**
 * Précharge uniquement l'image LCP sur mobile
 */
export const preloadMobileLCP = () => {
  if (typeof window === 'undefined') return;
  
  // Ne précharger que sur mobile
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/hero-kaaba-new.webp';
  link.type = 'image/webp';
  link.fetchPriority = 'high';
  
  // Nettoyer après 10s
  setTimeout(() => link.remove(), 10000);
  
  document.head.appendChild(link);
};
