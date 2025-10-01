import { supabase } from '@/integrations/supabase/client';

/**
 * Optimise une URL d'image Supabase avec des paramètres de transformation ultra-agressifs
 * @param url - URL de base
 * @param options - Options d'optimisation
 */
export const optimizeSupabaseImage = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
} = {}) => {
  // Retourner directement l'URL sans transformations
  // car Supabase Storage ne supporte pas les transformations d'images avancées
  return url;
};

/**
 * Get the public URL for an image from a Supabase bucket
 * @param imagePath - The path of the image in the bucket
 * @param optimize - Optional optimization parameters
 * @param bucketName - The bucket name (defaults to 'ad-images')
 * @returns The public URL of the image
 */
export const getImageUrl = (
  imagePath: string | null | undefined, 
  optimize: { width?: number; height?: number; quality?: number } = {},
  bucketName: string = 'ad-images'
): string => {
  console.log('🖼️ getImageUrl called with:', imagePath, 'bucket:', bucketName);
  
  if (!imagePath) {
    console.log('❌ No image path provided, returning placeholder');
    return '/ad-placeholder.jpg';
  }
  
  // If it's already a full URL, optimize it
  if (imagePath.startsWith('http')) {
    console.log('✅ Already full URL:', imagePath);
    return optimizeSupabaseImage(imagePath, optimize);
  }
  
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(imagePath);
    
    const optimizedUrl = optimizeSupabaseImage(data.publicUrl, optimize);
    console.log('✅ Generated optimized URL:', optimizedUrl);
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