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

      // Goal: ID photo should NOT be overly zoomed/cropped.
      // We fit the full image into a square (with a small margin),
      // and we render at higher resolution then downsample for sharpness.

      const scaleFactor = 2; // super-sampling to reduce blur on downscale
      const hiSize = size * scaleFactor;

      const hiCanvas = document.createElement('canvas');
      hiCanvas.width = hiSize;
      hiCanvas.height = hiSize;
      const hiCtx = hiCanvas.getContext('2d', { alpha: false });

      if (!hiCtx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      // High quality scaling
      hiCtx.imageSmoothingEnabled = true;
      hiCtx.imageSmoothingQuality = 'high';

      // White background
      hiCtx.fillStyle = '#FFFFFF';
      hiCtx.fillRect(0, 0, hiSize, hiSize);

      // Fit image INSIDE the square (contain), with a small margin
      const margin = Math.round(hiSize * 0.06); // ~6% padding
      const available = hiSize - margin * 2;

      const scale = Math.min(available / img.width, available / img.height);
      const drawW = Math.round(img.width * scale);
      const drawH = Math.round(img.height * scale);

      const dstX = Math.round((hiSize - drawW) / 2);
      // Slightly bias upward (face is usually higher), but keep within bounds
      const centerY = (hiSize - drawH) / 2;
      const biasY = -Math.round(hiSize * 0.03);
      const dstY = Math.max(margin, Math.round(centerY + biasY));

      hiCtx.drawImage(img, dstX, dstY, drawW, drawH);

      // Downsample to final 200x200
      const outCanvas = document.createElement('canvas');
      outCanvas.width = size;
      outCanvas.height = size;
      const outCtx = outCanvas.getContext('2d', { alpha: false });

      if (!outCtx) {
        reject(new Error('Could not create canvas context'));
        return;
      }

      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = 'high';
      outCtx.fillStyle = '#FFFFFF';
      outCtx.fillRect(0, 0, size, size);
      outCtx.drawImage(hiCanvas, 0, 0, size, size);

      // Export: PNG avoids extra compression blur; Nusuk usually accepts JPG too,
      // but PNG gives the crispest result at small sizes.
      outCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/png'
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
export function downloadConvertedPhoto(blob: Blob, filename: string = 'photo-nusuk-hajj.png'): void {
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
