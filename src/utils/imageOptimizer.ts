/**
 * Utilitaires d'optimisation d'images pour améliorer les Core Web Vitals
 * Focalisé sur la réduction du CLS et l'amélioration du LCP
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface OptimizationConfig {
  quality?: number;
  format?: 'avif' | 'webp' | 'jpg';
  lazy?: boolean;
  priority?: boolean;
}

/**
 * Calcule les dimensions optimales pour une image responsive
 * tout en préservant l'aspect ratio
 */
export const calculateResponsiveDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number
): ImageDimensions => {
  const aspectRatio = originalWidth / originalHeight;
  
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  return {
    width: maxWidth,
    height: Math.round(maxWidth / aspectRatio)
  };
};

/**
 * Génère un srcset pour images responsive
 * avec des breakpoints optimisés pour mobile et desktop
 */
export const generateResponsiveSrcSet = (
  basePath: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536]
): string => {
  return sizes
    .map(size => `${basePath}?w=${size}&q=80 ${size}w`)
    .join(', ');
};

/**
 * Génère une liste de sizes optimisée pour différents breakpoints
 */
export const generateSizesAttribute = (
  mobileVw: number = 100,
  tabletVw: number = 50,
  desktopVw: number = 33
): string => {
  return `(max-width: 640px) ${mobileVw}vw, (max-width: 1024px) ${tabletVw}vw, ${desktopVw}vw`;
};

/**
 * Génère un placeholder blur data URL pour réduire le CLS
 */
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='/%3E%3C/svg%3E`;
};

/**
 * Dimensions prédéfinies pour différents types de cartes
 * pour garantir la cohérence et éviter le CLS
 */
export const CARD_DIMENSIONS = {
  hero: { width: 1600, height: 900 },
  card: { width: 640, height: 360 },
  thumbnail: { width: 320, height: 180 },
  avatar: { width: 128, height: 128 },
  logo: { width: 200, height: 60 }
} as const;

/**
 * Configuration d'optimisation par défaut pour mobile
 */
export const MOBILE_OPTIMIZATION: OptimizationConfig = {
  quality: 80,
  format: 'avif',
  lazy: true,
  priority: false
};

/**
 * Configuration d'optimisation pour images above-the-fold
 */
export const HERO_OPTIMIZATION: OptimizationConfig = {
  quality: 85,
  format: 'avif',
  lazy: false,
  priority: true
};

/**
 * Vérifie si une image doit être chargée en priorité
 * basé sur sa position dans le viewport
 */
export const shouldPrioritizeImage = (elementTop: number, viewportHeight: number): boolean => {
  return elementTop < viewportHeight * 1.5; // Dans les 150% du viewport
};

/**
 * Précharge une image critique pour améliorer le LCP
 */
export const preloadImage = (src: string, as: 'image' = 'image', type?: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  if (type) link.type = type;
  link.fetchPriority = 'high';
  
  document.head.appendChild(link);
};

/**
 * Convertit les images PNG non optimisées en AVIF/WebP
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  config: OptimizationConfig = MOBILE_OPTIMIZATION
): string => {
  // Si l'URL est déjà optimisée, la retourner
  if (originalUrl.includes('.avif') || originalUrl.includes('.webp')) {
    return originalUrl;
  }
  
  // Déterminer le format cible
  const format = config.format || 'avif';
  const quality = config.quality || 80;
  
  // Remplacer l'extension
  return originalUrl.replace(/\.(png|jpg|jpeg)$/i, `.${format}?q=${quality}`);
};

export default {
  calculateResponsiveDimensions,
  generateResponsiveSrcSet,
  generateSizesAttribute,
  generateBlurDataURL,
  CARD_DIMENSIONS,
  MOBILE_OPTIMIZATION,
  HERO_OPTIMIZATION,
  shouldPrioritizeImage,
  preloadImage,
  getOptimizedImageUrl
};
