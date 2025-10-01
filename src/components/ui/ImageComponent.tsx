import React, { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  bucketName?: string;
}

export const ImageComponent = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  onClick,
  bucketName = 'ad-images'
}: ImageComponentProps) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallbackSrc;
    // Pas d'optimisation pour éviter le délai de transformation
    return getImageUrl(src, undefined, bucketName);
  });

  const handleError = () => {
    if (hasError) return;
    
    const extensions = ['webp', 'jpeg', 'jpg', 'png', 'avif'];
    
    if (retryCount < extensions.length && src) {
      let newSrc: string;
      
      // Pour les URLs complètes, remplacer l'extension dans l'URL
      if (src.startsWith('http')) {
        const urlWithoutExt = src.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '');
        const newExt = extensions[retryCount];
        newSrc = `${urlWithoutExt}.${newExt}`;
        console.log(`🔄 Tentative ${retryCount + 1}/${extensions.length}: ${newSrc}`);
      } else {
        // Pour les chemins relatifs
        const pathWithoutExt = src.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '');
        const newExt = extensions[retryCount];
        const newPath = `${pathWithoutExt}.${newExt}`;
        newSrc = getImageUrl(newPath, undefined, bucketName);
        console.log(`🔄 Tentative ${retryCount + 1}/${extensions.length}: Essai avec .${newExt}`);
      }
      
      setRetryCount(prev => prev + 1);
      setCurrentSrc(newSrc);
    } else {
      console.error('❌ Toutes les extensions ont échoué, affichage du fallback');
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ImageComponent;