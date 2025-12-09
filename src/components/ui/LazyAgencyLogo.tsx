import { useState, useEffect, useRef } from 'react';

interface LazyAgencyLogoProps {
  src: string;
  alt: string;
  agencyName: string;
  className?: string;
}

export const LazyAgencyLogo = ({ src, alt, agencyName, className = '' }: LazyAgencyLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Charge 50px avant d'être visible
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          width={160}
          height={60}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '160px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};
