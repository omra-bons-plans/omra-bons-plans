import { supabase } from '@/integrations/supabase/client';

/**
 * Get the direct Supabase Storage URL without transformation parameters
 * @param url - Base URL
 */
export const optimizeSupabaseImage = (url: string) => {
  // Return URL directly - Supabase Storage doesn't support transformation parameters by default
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
  
  // If it's already a full URL, return it directly
  if (imagePath.startsWith('http')) {
    console.log('✅ Already full URL:', imagePath);
    return imagePath;
  }
  
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(imagePath);
    
    console.log('✅ Generated URL:', data.publicUrl);
    return data.publicUrl;
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