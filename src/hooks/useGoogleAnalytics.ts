import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Déclaration globale pour gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGoogleAnalytics = (measurementId?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId) return;

    // Initialiser Google Analytics seulement si pas encore fait
    if (!window.gtag) {
      // Créer le script GA4
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script1);

      // Créer le script de configuration
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: false
        });
      `;
      document.head.appendChild(script2);

      // Initialiser gtag globalement
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    // Tracker les changements de page pour les SPAs
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Envoyer un événement page_view
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
    });
  }, [location, measurementId]);

  // Fonction pour tracker des événements personnalisés
  const trackEvent = (eventName: string, parameters?: { [key: string]: any }) => {
    if (!window.gtag) return;
    
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: eventName,
      ...parameters,
    });
  };

  // Fonction pour tracker les conversions
  const trackConversion = (conversionName: string, value?: number, currency = 'EUR') => {
    if (!window.gtag) return;
    
    window.gtag('event', 'conversion', {
      send_to: measurementId,
      event_category: 'conversion',
      event_label: conversionName,
      value: value,
      currency: currency,
    });
  };

  // Fonction pour tracker les recherches
  const trackSearch = (searchTerm: string, category?: string) => {
    trackEvent('search', {
      search_term: searchTerm,
      event_category: category || 'site_search',
    });
  };

  // Fonction pour tracker les clics sur les annonces
  const trackAdClick = (adId: string, adTitle: string, category: string) => {
    trackEvent('select_content', {
      content_type: 'advertisement',
      content_id: adId,
      event_category: 'ad_interaction',
      event_label: `${category}: ${adTitle}`,
    });
  };

  return {
    trackEvent,
    trackConversion,
    trackSearch,
    trackAdClick,
  };
};

export default useGoogleAnalytics;