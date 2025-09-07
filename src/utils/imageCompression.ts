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
 * Compresse une image File en réduisant sa taille et/ou qualité
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
              'image/jpeg',
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
            return new File([blob], file.name, {
              type: 'image/jpeg',
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