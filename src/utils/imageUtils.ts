import { supabase } from '@/integrations/supabase/client';

/**
 * Get the public URL for an image in the ad-images bucket
 * @param imagePath - The path of the image in the bucket
 * @returns The public URL or null if invalid
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  try {
    const { data } = supabase.storage
      .from('ad-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
};

/**
 * Get multiple image URLs
 * @param imagePaths - Array of image paths
 * @returns Array of public URLs (null for invalid paths)
 */
export const getImageUrls = (imagePaths: string[]): (string | null)[] => {
  return imagePaths.map(path => getImageUrl(path));
};