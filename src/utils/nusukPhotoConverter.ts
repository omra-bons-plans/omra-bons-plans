import { supabase } from '@/integrations/supabase/client';

export interface ConversionProgress {
  stage: 'loading' | 'removing-bg' | 'processing' | 'resizing' | 'complete';
  progress: number;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

/**
 * Remove background using AI
 */
async function removeBackgroundWithAI(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append('image', file);

  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await supabase.functions.invoke('remove-background', {
    body: formData,
  });

  if (response.error) {
    throw new Error(response.error.message || 'Failed to remove background');
  }

  const { image } = response.data;
  
  if (!image) {
    throw new Error('No processed image returned');
  }

  // Convert base64 data URL to Blob
  const base64Data = image.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/png' });
}

/**
 * Convert image to Nusuk format (200x200, white background)
 * Now with AI background removal!
 */
export async function convertToNusukFormat(
  file: File,
  onProgress?: ProgressCallback,
  removeBackground: boolean = true
): Promise<Blob> {
  // Stage 1: Loading image
  onProgress?.({ stage: 'loading', progress: 10 });
  
  let imageBlob: Blob;
  
  if (removeBackground) {
    // Stage 2: Remove background with AI
    onProgress?.({ stage: 'removing-bg', progress: 30 });
    
    try {
      imageBlob = await removeBackgroundWithAI(file);
    } catch (error) {
      console.error('Background removal failed, using original:', error);
      // Fallback to original image if AI fails
      imageBlob = await loadImageAsBlob(file);
    }
  } else {
    imageBlob = await loadImageAsBlob(file);
  }
  
  // Stage 3: Processing
  onProgress?.({ stage: 'processing', progress: 70 });
  
  // Stage 4: Resize and add white background
  onProgress?.({ stage: 'resizing', progress: 85 });
  
  const result = await centerImageOnWhiteBackground(imageBlob, 200);
  
  onProgress?.({ stage: 'complete', progress: 100 });
  
  return result;
}

/**
 * Load file as blob
 */
async function loadImageAsBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      resolve(blob);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Center the image on a white background canvas with specified size
 * Uses high-quality resizing and proper ID photo framing
 */
export async function centerImageOnWhiteBackground(
  imageBlob: Blob,
  size: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // For ID photos, we want to:
      // 1. Keep aspect ratio if possible
      // 2. Crop from top (face is usually in upper portion)
      // 3. Use high-quality scaling
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { alpha: false });
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      // Enable high-quality image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      
      // Calculate crop dimensions (center horizontally, bias toward top for face)
      const aspectRatio = img.width / img.height;
      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      
      if (aspectRatio > 1) {
        // Wider than tall - crop sides, keep full height
        srcW = img.height;
        srcX = (img.width - srcW) / 2;
      } else if (aspectRatio < 1) {
        // Taller than wide - crop from bottom (keep top where face is)
        srcH = img.width;
        srcY = 0; // Start from top to keep the face
      }
      // If square, use full image
      
      // Draw with high quality
      ctx.drawImage(
        img,
        srcX, srcY, srcW, srcH,  // Source (cropped)
        0, 0, size, size         // Destination (full canvas)
      );
      
      // Convert to blob with maximum quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        1.0  // Maximum quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Download the converted photo
 */
export function downloadConvertedPhoto(blob: Blob, filename: string = 'photo-nusuk-hajj.jpg'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate that file is an acceptable image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP.',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Fichier trop volumineux. Maximum 10 Mo.',
    };
  }
  
  return { valid: true };
}
