/**
 * Utilitaires pour la compression d'images dans le navigateur
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * Compresse une image File en réduisant sa taille et/ou qualité avec support WebP
 */
export const compressImage = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeKB = 1024 // 1MB par défaut
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Détecter le support WebP du navigateur
        const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
        const outputFormat = supportsWebP ? 'image/webp' : 'image/jpeg';
        const fileExtension = supportsWebP ? 'webp' : 'jpg';
        
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
        const compressWithQuality = async (currentQuality: number): Promise<File> => {
          const blob = await createBlob(currentQuality);
          const sizeKB = blob.size / 1024;
          
          // Si la taille est acceptable ou qu'on a atteint la qualité minimale
          if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
            // Générer le nouveau nom de fichier avec l'extension appropriée
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            return new File([blob], `${originalName}.${fileExtension}`, {
              type: outputFormat,
              lastModified: Date.now(),
            });
          }
          
          // Réduire la qualité et réessayer
          return compressWithQuality(currentQuality - 0.1);
        };

        compressWithQuality(quality).then(resolve).catch(reject);
        
      } catch (error) {
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
 * Convertit automatiquement une image en WebP si le navigateur le supporte
 */
export const convertToWebP = async (file: File, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Vérifier le support WebP
      const supportsWebP = canvas.toDataURL('image/webp').startsWith('data:image/webp');
      
      if (!supportsWebP) {
        // Retourner le fichier original si WebP n'est pas supporté
        resolve(file);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          } else {
            reject(new Error('Erreur lors de la conversion WebP'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
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