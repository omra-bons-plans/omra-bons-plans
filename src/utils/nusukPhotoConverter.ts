export interface ConversionProgress {
  stage: 'loading' | 'processing' | 'resizing' | 'complete';
  progress: number;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

/**
 * Convert image to Nusuk format (200x200, white background)
 * Note: This does not remove background - user should provide a photo with clean background
 */
export async function convertToNusukFormat(
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> {
  // Stage 1: Loading image
  onProgress?.({ stage: 'loading', progress: 10 });
  
  const imageBlob = await loadImageAsBlob(file);
  
  // Stage 2: Processing
  onProgress?.({ stage: 'processing', progress: 50 });
  
  // Stage 3: Resize and add white background
  onProgress?.({ stage: 'resizing', progress: 75 });
  
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
 * Crops to square and centers the subject
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
      
      // Calculate crop to make square (center crop)
      const minDimension = Math.min(img.width, img.height);
      const cropX = (img.width - minDimension) / 2;
      const cropY = (img.height - minDimension) / 2;
      
      // Draw the image cropped and scaled to fit
      ctx.drawImage(
        img,
        cropX, cropY, minDimension, minDimension,  // Source crop
        0, 0, size, size  // Destination
      );
      
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
