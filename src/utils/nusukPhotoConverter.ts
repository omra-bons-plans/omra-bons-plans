import { removeBackground } from '@imgly/background-removal';

export interface ConversionProgress {
  stage: 'loading' | 'removing-bg' | 'downloading-model' | 'processing' | 'resizing' | 'complete';
  progress: number;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

/**
 * Remove background using local AI (runs in browser - free, no API credits!)
 */
async function removeBackgroundLocal(imageBlob: Blob, onProgress?: ProgressCallback): Promise<Blob> {
  try {
    const result = await removeBackground(imageBlob, {
      output: {
        format: 'image/png',
        quality: 1.0
      },
      progress: (key, current, total) => {
        // Report model download progress
        if (key === 'fetch:model' && onProgress) {
          const downloadProgress = Math.round((current / total) * 20) + 10; // 10-30%
          onProgress({ stage: 'downloading-model', progress: downloadProgress });
        }
      }
    });
    return result;
  } catch (error) {
    console.error('Local background removal failed:', error);
    throw error;
  }
}

/**
 * Convert image to Nusuk format (200x200, white background)
 * Now with AI background removal!
 */
export async function convertToNusukFormat(
  file: File,
  onProgress?: ProgressCallback,
  removeBackgroundOption: boolean = true
): Promise<Blob> {
  // Stage 1: Loading image
  onProgress?.({ stage: 'loading', progress: 5 });
  
  let imageBlob: Blob = await loadImageAsBlob(file);
  
  if (removeBackgroundOption) {
    // Stage 2: Remove background with local AI
    onProgress?.({ stage: 'removing-bg', progress: 10 });
    
    try {
      imageBlob = await removeBackgroundLocal(imageBlob, onProgress);
    } catch (error) {
      console.error('Background removal failed, using original:', error);
      // Fallback to original image if AI fails
    }
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
