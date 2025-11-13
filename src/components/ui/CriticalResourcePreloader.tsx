import { useEffect } from 'react';

/**
 * Préchargeur de ressources critiques pour améliorer le LCP
 * Note: Les images hero sont déjà préchargées dans index.html
 */
const CriticalResourcePreloader = () => {
  useEffect(() => {
    // Précharger uniquement les polices critiques
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    ];

    criticalFonts.forEach(href => {
      // Vérifier si le lien n'existe pas déjà
      if (!document.querySelector(`link[href="${href}"]`)) {
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
      }
    });

    // Précharger les données critiques en idle time
    const prefetchData = async () => {
      try {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            // Précharger les données d'annonces
            const supabaseUrl = 'https://lptyhenryzhztdwpkvsc.supabase.co';
            fetch(`${supabaseUrl}/rest/v1/ads?limit=5&order=created_at.desc&is_published=eq.true`, {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4'
              }
            })
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