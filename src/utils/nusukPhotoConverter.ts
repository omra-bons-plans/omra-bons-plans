import { removeBackground } from '@imgly/background-removal';

export interface ConversionProgress {
  stage: 'loading' | 'removing-background' | 'resizing' | 'complete';
  progress: number;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

/**
 * Remove background from image and convert to Nusuk format (200x200, white background)
 */
export async function removeBackgroundAndConvert(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  // Stage 1: Loading image
  onProgress?.({ stage: 'loading', progress: 10 });
  
  // Stage 2: Remove background using AI
  onProgress?.({ stage: 'removing-background', progress: 20 });
  
  const blob = await removeBackground(file, {
    progress: (key, current, total) => {
      const progressPercent = 20 + (current / total) * 50;
      onProgress?.({ stage: 'removing-background', progress: Math.round(progressPercent) });
    },
  });
  
  // Stage 3: Resize and add white background
  onProgress?.({ stage: 'resizing', progress: 75 });
  
  const result = await centerImageOnWhiteBackground(blob, 200);
  
  onProgress?.({ stage: 'complete', progress: 100 });
  
  return result;
}

/**
 * Center the image on a white background canvas with specified size
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
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      
      // Calculate scale to fit image
      const scale = Math.min(size / img.width, size / img.height) * 0.9; // 90% to add padding
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      
      // Center the image
      const x = (size - newWidth) / 2;
      const y = (size - newHeight) / 2;
      
      // Draw the image
      ctx.drawImage(img, x, y, newWidth, newHeight);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        0.95
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
