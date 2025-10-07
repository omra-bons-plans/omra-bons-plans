import { supabase } from '@/integrations/supabase/client';

/**
 * Optimise une URL d'image Supabase avec transformations
 * @param url - URL de base de l'image
 * @param optimize - Paramètres d'optimisation
 */
const optimizeSupabaseImage = (
  url: string,
  optimize?: { width?: number; height?: number; quality?: number }
) => {
  if (!optimize) return url;
  
  const params = new URLSearchParams();
  
  if (optimize.width) {
    params.append('width', optimize.width.toString());
  }
  if (optimize.height) {
    params.append('height', optimize.height.toString());
  }
  if (optimize.quality) {
    params.append('quality', optimize.quality.toString());
  }
  
  // Ajouter format WebP pour meilleure compression
  params.append('format', 'webp');
  
  return `${url}?${params.toString()}`;
};

/**
 * Get the public URL for an image from a Supabase bucket
 * Handles multiple file extensions automatically (.png, .jpg, .jpeg, .webp, .avif)
 * @param imagePath - The path of the image in the bucket
 * @param optimize - Optional optimization parameters
 * @param bucketName - The bucket name (defaults to 'ad-images')
 * @returns The public URL of the image
 */
export const getImageUrl = (
  imagePath: string | null | undefined, 
  optimize?: { width?: number; height?: number; quality?: number },
  bucketName: string = 'ad-images'
): string => {
  console.log('🖼️ getImageUrl called with:', imagePath, 'bucket:', bucketName);
  
  if (!imagePath) {
    console.log('❌ No image path provided, returning placeholder');
    return '/ad-placeholder.jpg';
  }
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http')) {
    console.log('✅ Already full URL:', imagePath);
    return imagePath;
  }
  
  try {
    // Extraire le chemin sans extension
    const pathWithoutExt = imagePath.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '');
    const originalExt = imagePath.match(/\.(png|jpg|jpeg|webp|avif|gif)$/i)?.[1] || '';
    
    // Ordre de priorité des extensions (webp et avif sont plus modernes et compressés)
    const extensionsToTry = ['webp', 'jpeg', 'jpg', 'png', 'avif', 'gif'];
    
    // Si une extension originale existe, l'essayer en premier
    if (originalExt) {
      const extLower = originalExt.toLowerCase();
      // Retirer l'extension originale de la liste puis l'ajouter au début
      const filteredExts = extensionsToTry.filter(ext => ext !== extLower);
      extensionsToTry.length = 0;
      extensionsToTry.push(extLower, ...filteredExts);
    }
    
    // Pour la première tentative, on utilise le chemin original
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(imagePath);
    
    // Appliquer les optimisations Supabase si demandées
    const optimizedUrl = optimize ? optimizeSupabaseImage(data.publicUrl, optimize) : data.publicUrl;
    
    console.log('✅ Generated URL:', optimizedUrl, optimize ? '(optimized)' : '');
    
    return optimizedUrl;
  } catch (error) {
    console.error('💥 Error getting image URL:', error);
    return '/ad-placeholder.jpg';
  }
};

/**
 * Get multiple image URLs from an array of paths
 * @param imagePaths - Array of image paths
 * @param optimize - Optional optimization parameters
 * @param bucketName - The bucket name (defaults to 'ad-images')
 * @returns Array of public URLs
 */
export const getImageUrls = (
  imagePaths: string[], 
  optimize?: { width?: number; height?: number; quality?: number },
  bucketName?: string
): string[] => {
  return imagePaths.map(path => getImageUrl(path, optimize, bucketName));
};

/**
 * Précharge une image de manière optimisée
 * @param src - URL de l'image
 * @param priority - Si l'image est prioritaire
 */
export const preloadImage = (src: string, priority = false) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (priority) link.fetchPriority = 'high';
  
  link.onload = () => console.log('🚀 Image préchargée:', src);
  link.onerror = () => console.warn('⚠️ Échec préchargement:', src);
  
  document.head.appendChild(link);
  
  // Nettoyer après 10 secondes
  setTimeout(() => {
    if (document.head.contains(link)) {
      document.head.removeChild(link);
    }
  }, 10000);
};