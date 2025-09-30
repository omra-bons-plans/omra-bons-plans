import { useState, useEffect } from 'react';

interface HeroImageProps {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
}

// Tiny placeholder base64 (10x10px gradient blur)
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230B1E3A'/%3E%3Cstop offset='100%25' style='stop-color:%231a3a5c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23g)'/%3E%3C/svg%3E";

export const HeroImage = ({ mobileSrc, desktopSrc, alt }: HeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B1E3A] via-[#1a3a5c] to-[#0B1E3A]">
      {/* Desktop Image */}
      <img
        src={isLoaded ? desktopSrc : PLACEHOLDER}
        alt={alt}
        width="1920"
        height="1080"
        className={`absolute inset-0 w-full h-full object-cover hidden md:block transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Mobile Image */}
      <img
        src={isLoaded ? mobileSrc : PLACEHOLDER}
        alt={alt}
        width="800"
        height="1200"
        className={`absolute inset-0 w-full h-full object-cover block md:hidden transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Overlay */}
      <div className="hero-overlay absolute inset-0"></div>
    </div>
  );
};
