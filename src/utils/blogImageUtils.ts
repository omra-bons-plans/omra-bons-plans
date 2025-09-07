import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a public URL for a blog image
 * Handles both new Supabase Storage images and legacy external URLs
 */
export const getBlogImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '/ad-placeholder.jpg';
  }

  // Si c'est déjà une URL complète (legacy), la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('🖼️ Using external blog image URL:', imagePath);
    return imagePath;
  }

  // Si c'est un chemin Supabase Storage, générer l'URL publique
  try {
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(imagePath);
    
    console.log('🖼️ Generated blog image URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error generating blog image URL:', error);
    return '/ad-placeholder.jpg';
  }
};

/**
 * Check if an image URL is from Supabase Storage
 */
export const isBlogImageFromStorage = (imagePath: string | null | undefined): boolean => {
  if (!imagePath) return false;
  return !imagePath.startsWith('http://') && !imagePath.startsWith('https://');
};