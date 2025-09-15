import { useGoogleAnalytics } from './useGoogleAnalytics';

/**
 * Hook spécialisé pour tracker les interactions spécifiques à Omra Bons Plans
 */
export const useAnalyticsTracking = () => {
  const { trackEvent, trackSearch, trackAdClick, trackConversion } = useGoogleAnalytics();

  // Tracking des interactions avec les services
  const trackServiceClick = (serviceType: string, serviceId?: string) => {
    trackEvent('service_interaction', {
      event_category: 'services',
      event_label: serviceType,
      content_id: serviceId,
    });
  };

  // Tracking des filtres de recherche
  const trackFilterUsage = (filterType: string, filterValue: string) => {
    trackEvent('filter_usage', {
      event_category: 'search',
      event_label: `${filterType}: ${filterValue}`,
    });
  };

  // Tracking des pages de catégories
  const trackCategoryView = (category: string) => {
    trackEvent('page_view', {
      event_category: 'category',
      event_label: category,
      page_title: `Catégorie ${category}`,
    });
  };

  // Tracking des actions de contact
  const trackContactAction = (actionType: 'email' | 'phone' | 'whatsapp', adId?: string) => {
    trackEvent('contact_action', {
      event_category: 'lead_generation',
      event_label: actionType,
      content_id: adId,
    });
    
    // Tracker aussi comme conversion
    trackConversion(`contact_${actionType}`, 1);
  };

  // Tracking des réservations/demandes de devis
  const trackBookingRequest = (serviceType: string, value?: number) => {
    trackEvent('booking_request', {
      event_category: 'conversion',
      event_label: serviceType,
      value: value,
    });
    
    trackConversion('booking_request', value);
  };

  // Tracking de l'engagement avec le contenu
  const trackContentEngagement = (contentType: 'blog' | 'guide' | 'comparatif', contentId: string) => {
    trackEvent('content_engagement', {
      event_category: 'engagement',
      event_label: contentType,
      content_id: contentId,
    });
  };

  // Tracking des partages sociaux
  const trackSocialShare = (platform: string, contentType: string, contentId?: string) => {
    trackEvent('social_share', {
      event_category: 'social',
      event_label: `${platform}_${contentType}`,
      content_id: contentId,
    });
  };

  // Tracking des téléchargements de documents
  const trackDownload = (fileName: string, fileType: string) => {
    trackEvent('file_download', {
      event_category: 'downloads',
      event_label: `${fileType}: ${fileName}`,
    });
  };

  // Tracking des erreurs utilisateur
  const trackUserError = (errorType: string, errorMessage?: string) => {
    trackEvent('user_error', {
      event_category: 'errors',
      event_label: errorType,
      custom_parameter: errorMessage,
    });
  };

  return {
    // Analytics générales
    trackEvent,
    trackSearch,
    trackAdClick,
    trackConversion,
    
    // Analytics spécialisées
    trackServiceClick,
    trackFilterUsage,
    trackCategoryView,
    trackContactAction,
    trackBookingRequest,
    trackContentEngagement,
    trackSocialShare,
    trackDownload,
    trackUserError,
  };
};

export default useAnalyticsTracking;