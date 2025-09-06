import { supabase } from '@/integrations/supabase/client';

/**
 * Get the public URL for an image in the ad-images bucket
 * @param imagePath - The path of the image in the bucket
 * @returns The public URL or placeholder image
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  console.log('🖼️ getImageUrl called with:', imagePath);
  
  if (!imagePath) {
    console.log('❌ No image path provided, returning placeholder');
    return '/ad-placeholder.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    console.log('✅ Already full URL:', imagePath);
    return imagePath;
  }
  
  try {
    const { data } = supabase.storage
      .from('ad-images')
      .getPublicUrl(imagePath);
    
    console.log('✅ Generated URL:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('💥 Error getting image URL:', error);
    return '/ad-placeholder.jpg';
  }
};

/**
 * Get multiple image URLs
 * @param imagePaths - Array of image paths
 * @returns Array of public URLs
 */
export const getImageUrls = (imagePaths: string[]): string[] => {
  return imagePaths.map(path => getImageUrl(path));
};