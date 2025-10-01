import { useEffect } from 'react';

/**
 * Préchargeur de ressources critiques pour améliorer le LCP
 */
const CriticalResourcePreloader = () => {
  useEffect(() => {
    // Précharger les images critiques above-the-fold
    const criticalImages = [
      '/src/assets/mecca-mosque-hero.jpg', // Image hero principale
      '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png', // Image hero
      '/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png' // Logo
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    // Précharger les polices critiques
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    ];

    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // Charger aussi immédiatement le CSS
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = href;
      styleLink.media = 'print';
      styleLink.onload = () => {
        styleLink.media = 'all';
      };
      document.head.appendChild(styleLink);
    });

    // Précharger les données critiques
    const prefetchData = async () => {
      try {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            // Précharger les données d'annonces
            fetch('/rest/v1/ads?limit=5&order=created_at.desc')
              .then(response => response.json())
              .catch(console.error);
          });
        }
      } catch (error) {
        console.error('Erreur lors de la prélecture des données:', error);
      }
    };

    prefetchData();
  }, []);

  return null;
};

export default CriticalResourcePreloader;