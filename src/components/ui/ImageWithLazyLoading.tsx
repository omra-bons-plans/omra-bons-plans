import React, { useState, useRef, useEffect } from 'react';

interface ImageWithLazyLoadingProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const ImageWithLazyLoading = ({ 
  src, 
  alt, 
  className = "",
  placeholder = '/ad-placeholder.jpg'
}: ImageWithLazyLoadingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={imgRef}>
      <img
        src={isInView ? src : placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithLazyLoading;