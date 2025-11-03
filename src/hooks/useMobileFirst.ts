import { useEffect, useState } from 'react';

/**
 * Hook Mobile-First pour optimiser l'expérience mobile
 * - Détecte si l'appareil est mobile (< 768px)
 * - Gère les optimisations de performance mobile
 * - Retourne des helpers pour le responsive design
 */
export const useMobileFirst = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [isTablet, setIsTablet] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    // Utiliser matchMedia pour de meilleures performances
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleTabletChange = (e: MediaQueryListEvent) => setIsTablet(e.matches);

    mobileQuery.addEventListener('change', handleMobileChange);
    tabletQuery.addEventListener('change', handleTabletChange);

    // Init
    handleResize();

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      tabletQuery.removeEventListener('change', handleTabletChange);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    // Helpers
    showMobileUI: isMobile,
    showDesktopUI: !isMobile,
    // Classes Tailwind conditionnelles
    mobileClass: (className: string) => isMobile ? className : '',
    desktopClass: (className: string) => !isMobile ? className : '',
  };
};
