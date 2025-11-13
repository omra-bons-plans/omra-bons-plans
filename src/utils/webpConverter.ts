/**
 * Utilitaire pour gérer les images WebP avec fallback PNG
 * Utilisé pour optimiser les logos d'agences
 */

/**
 * Retourne l'URL WebP si disponible, sinon PNG
 */
export const getOptimizedLogoUrl = (basePath: string): string => {
  // Remplace .png ou .webp par .webp
  const webpPath = basePath.replace(/\.(png|webp)$/i, '.webp');
  
  // Support de WebP : on utilise la version WebP
  // Si le fichier n'existe pas, le navigateur fera un fallback vers PNG
  if (supportsWebP()) {
    return webpPath;
  }
  
  // Fallback PNG pour les anciens navigateurs
  return basePath.replace(/\.webp$/i, '.png');
};

/**
 * Détecte si le navigateur supporte WebP
 */
export const supportsWebP = (): boolean => {
  // Cache du résultat
  if (typeof window === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // WebP lossy
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Génère un srcset optimisé pour responsive images
 */
export const generateResponsiveSrcSet = (basePath: string, sizes: number[] = [320, 640, 960, 1280]): string => {
  const webpPath = basePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return sizes.map(size => {
    // Pour Supabase storage ou CDN avec paramètres de resize
    if (basePath.includes('supabase') || basePath.includes('cdn')) {
      return `${webpPath}?width=${size}&quality=85 ${size}w`;
    }
    return `${webpPath} ${size}w`;
  }).join(', ');
};
