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
  const { 
    width = 800, 
    height, 
    quality = 40, // Qualité ultra-agressive pour LCP
    format = 'webp', // WebP par défaut pour compression maximale
    resize = 'cover'
  } = options;
  
  // Convertir les chemins lovable-uploads vers Supabase Storage pour optimisation
  let fullUrl = url;
  if (url.startsWith('/lovable-uploads/') || url.startsWith('lovable-uploads/')) {
    const path = url.replace(/^\//, '');
    const { data } = supabase.storage
      .from('ad-images')
      .getPublicUrl(path);
    fullUrl = data.publicUrl;
    console.log('📍 URL générée depuis Supabase:', fullUrl);
  }
  
  // Ajouter les paramètres de transformation Supabase
  if (fullUrl.includes('supabase.co/storage/v1/object/public/')) {
    // Utiliser l'API de transformation Supabase
    const transformUrl = fullUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    
    const params = new URLSearchParams();
    params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('quality', quality.toString());
    params.append('format', format);
    params.append('resize', resize);
    
    const optimizedUrl = `${transformUrl}?${params.toString()}`;
    console.log('🎯 URL optimisée finale:', optimizedUrl);
    
    return optimizedUrl;
  }
  
  console.log('⚠️ URL non Supabase, retour sans optimisation:', fullUrl);
  return fullUrl;
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