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
    return getImageUrl(src, undefined, bucketName);
  });

  const handleError = () => {
    if (hasError) return; // Déjà en erreur, ne rien faire
    
    // Extensions à essayer dans l'ordre
    const extensions = ['webp', 'jpeg', 'jpg', 'png', 'avif'];
    
    if (retryCount < extensions.length && src && !src.startsWith('http')) {
      // Extraire le chemin sans extension
      const pathWithoutExt = src.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '');
      const newExt = extensions[retryCount];
      const newPath = `${pathWithoutExt}.${newExt}`;
      
      console.log(`🔄 Tentative ${retryCount + 1}/${extensions.length}: Essai avec .${newExt}`);
      
      setRetryCount(prev => prev + 1);
      setCurrentSrc(getImageUrl(newPath, undefined, bucketName));
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