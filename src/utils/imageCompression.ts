/**
 * Utilitaires pour la compression d'images dans le navigateur
 * Optimisé pour AVIF > WebP > JPEG avec compression ultra-agressive
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  format?: 'avif' | 'webp' | 'jpeg' | 'auto';
}

/**
 * Compresse une image File avec AVIF prioritaire, puis WebP, puis JPEG
 * Compression ultra-agressive pour SEO optimal
 */
export const compressImage = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.7, // Qualité plus agressive par défaut
    maxSizeKB = 150, // Taille cible drastiquement réduite
    format = 'auto'
  } = options;

  console.log(`📸 Compression de ${file.name} (${formatFileSize(file.size)})`);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }

        // Calculer les nouvelles dimensions en maintenant le ratio
        let { width, height } = calculateNewDimensions(
          img.naturalWidth, 
          img.naturalHeight, 
          maxWidth, 
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée avec antialiasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Détecter le support des formats modernes
        const supportsAVIF = await testFormatSupport(canvas, 'image/avif');
        const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
        
        // Déterminer le meilleur format selon priorité: AVIF > WebP > JPEG
        let outputFormat: string;
        let fileExtension: string;
        
        if (format === 'auto') {
          if (supportsAVIF) {
            outputFormat = 'image/avif';
            fileExtension = 'avif';
            console.log('✨ Format AVIF utilisé (meilleure compression)');
          } else if (supportsWebP) {
            outputFormat = 'image/webp';
            fileExtension = 'webp';
            console.log('✅ Format WebP utilisé');
          } else {
            outputFormat = 'image/jpeg';
            fileExtension = 'jpg';
            console.log('📷 Format JPEG utilisé (fallback)');
          }
        } else {
          outputFormat = `image/${format}`;
          fileExtension = format === 'jpeg' ? 'jpg' : format;
        }
        
        // Fonction pour créer le blob avec la qualité donnée
        const createBlob = (currentQuality: number): Promise<Blob> => {
          return new Promise((blobResolve) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  blobResolve(blob);
                } else {
                  reject(new Error('Erreur lors de la compression'));
                }
              },
              outputFormat,
              currentQuality
            );
          });
        };

        // Compresser avec ajustement dynamique de la qualité si nécessaire
        const compressWithQuality = async (currentQuality: number, attempts = 0): Promise<File> => {
          const blob = await createBlob(currentQuality);
          const sizeKB = blob.size / 1024;
          
          console.log(`🔄 Tentative ${attempts + 1}: ${sizeKB.toFixed(1)}KB avec qualité ${(currentQuality * 100).toFixed(0)}%`);
          
          // Si la taille est acceptable ou qu'on a atteint la qualité minimale
          if (sizeKB <= maxSizeKB || currentQuality <= 0.3 || attempts >= 8) {
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const originalSizeKB = file.size / 1024;
            const compressionRatio = ((originalSizeKB - sizeKB) / originalSizeKB * 100).toFixed(1);
            
            console.log(`✅ Compression terminée: ${originalSizeKB.toFixed(1)}KB → ${sizeKB.toFixed(1)}KB (-${compressionRatio}%)`);
            
            return new File([blob], `${originalName}.${fileExtension}`, {
              type: outputFormat,
              lastModified: Date.now(),
            });
          }
          
          // Réduire la qualité plus agressivement
          return compressWithQuality(currentQuality - 0.08, attempts + 1);
        };

        const result = await compressWithQuality(quality);
        resolve(result);
        
      } catch (error) {
        console.error('❌ Erreur compression:', error);
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Erreur lors du chargement de l\'image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Teste si un format d'image est supporté par le navigateur
 */
const testFormatSupport = (canvas: HTMLCanvasElement, format: string): Promise<boolean> => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob !== null && blob.type === format),
      format,
      0.5
    );
  });
};

/**
 * Convertit automatiquement une image en AVIF ou WebP selon le support du navigateur
 */
export const convertToWebP = async (file: File, quality = 0.7): Promise<File> => {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Vérifier le support AVIF en priorité
      const supportsAVIF = await testFormatSupport(canvas, 'image/avif');
      const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
      
      let format: string;
      let mimeType: string;
      let extension: string;
      
      if (supportsAVIF) {
        format = 'image/avif';
        mimeType = 'image/avif';
        extension = 'avif';
      } else if (supportsWebP) {
        format = 'image/webp';
        mimeType = 'image/webp';
        extension = 'webp';
      } else {
        // Retourner le fichier original si ni AVIF ni WebP ne sont supportés
        resolve(file);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const convertedFile = new File([blob], `${originalName}.${extension}`, {
              type: mimeType,
              lastModified: Date.now(),
            });
            
            const originalSizeKB = file.size / 1024;
            const newSizeKB = blob.size / 1024;
            const savings = ((originalSizeKB - newSizeKB) / originalSizeKB * 100).toFixed(1);
            
            console.log(`✅ Conversion ${extension.toUpperCase()}: ${originalSizeKB.toFixed(1)}KB → ${newSizeKB.toFixed(1)}KB (-${savings}%)`);
            
            resolve(convertedFile);
          } else {
            reject(new Error(`Erreur lors de la conversion ${extension.toUpperCase()}`));
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Convertit les images HEIC/HEIF en JPEG (pour les photos iPhone)
 */
export const convertHEICtoJPEG = async (file: File): Promise<File> => {
  // Pour HEIC, on doit utiliser une bibliothèque externe ou un service
  // Pour l'instant, on retourne le fichier tel quel
  // TODO: Implémenter conversion HEIC si nécessaire
  console.warn('⚠️ Conversion HEIC non implémentée, fichier retourné tel quel');
  return file;
};

/**
 * Calcule les nouvelles dimensions en gardant le ratio d'aspect
 */
const calculateNewDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  // Réduire si l'image est plus grande que les dimensions maximales
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Vérifie si un fichier est une image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Formate la taille d'un fichier en Ko/Mo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};