import React, { useState } from 'react';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  bucketName?: string;
  responsive?: boolean; // Activer les images responsives
  sizes?: string; // Custom sizes attribute
}

export const ImageComponent = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/ad-placeholder.jpg',
  onClick,
  bucketName = 'ad-images',
  responsive = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: ImageComponentProps) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Generate srcset for responsive images
  const generateSrcSet = (imagePath: string) => {
    if (!responsive || !imagePath || imagePath.startsWith('http')) {
      return undefined;
    }
    
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => {
        const url = getImageUrl(imagePath, { width, quality: 80 }, bucketName);
        return `${url} ${width}w`;
      })
      .join(', ');
  };

  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallbackSrc;
    // Optimiser pour mobile par défaut (640px de large)
    return getImageUrl(src, responsive ? { width: 640, quality: 80 } : undefined, bucketName);
  });

  const [srcSet, setSrcSet] = useState(() => {
    if (!src) return undefined;
    return generateSrcSet(src);
  });

  const handleError = () => {
    console.error('❌ Erreur chargement image:', currentSrc, 'Retry:', retryCount);
    
    if (hasError) return;
    
    // Extensions à essayer (webp et jpeg en priorité car ce sont celles présentes dans le storage)
    const extensions = ['webp', 'jpeg', 'jpg', 'png', 'avif', 'gif'];
    
    if (retryCount < extensions.length && src) {
      let newSrc: string;
      const pathWithoutExt = src.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '');
      const newExt = extensions[retryCount];
      
      // Pour les URLs complètes, remplacer l'extension dans l'URL
      if (currentSrc.startsWith('http')) {
        const urlWithoutExt = currentSrc.replace(/\.(png|jpg|jpeg|webp|avif|gif)(\?.*)?$/i, '');
        newSrc = `${urlWithoutExt}.${newExt}`;
        console.log(`🔄 URL Retry ${retryCount + 1}/${extensions.length}: .${newExt}`);
      } else {
        // Pour les chemins relatifs
        const newPath = `${pathWithoutExt}.${newExt}`;
        newSrc = getImageUrl(newPath, responsive ? { width: 640, quality: 80 } : undefined, bucketName);
        setSrcSet(generateSrcSet(newPath));
        console.log(`🔄 Path Retry ${retryCount + 1}/${extensions.length}: ${newPath}`);
      }
      
      setRetryCount(prev => prev + 1);
      setCurrentSrc(newSrc);
    } else {
      console.error('❌ Toutes les extensions ont échoué pour:', src);
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setSrcSet(undefined);
    }
  };

  return (
    <img
      src={currentSrc}
      srcSet={srcSet}
      sizes={responsive ? sizes : undefined}
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