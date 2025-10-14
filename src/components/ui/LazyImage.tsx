import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Lazy loading image component with Intersection Observer
 * Only loads images when they're about to enter viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(priority ? src : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Skip lazy loading for priority images
    if (priority) {
      setIsLoaded(true);
      return;
    }

    // Use Intersection Observer for lazy loading
    if (!imgRef.current || !('IntersectionObserver' in window)) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, priority]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage;
