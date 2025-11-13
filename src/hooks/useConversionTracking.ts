import { useState, useCallback } from 'react';

interface ConversionEvent {
  offer_id: string;
  agency_name: string;
  event_type: 'view' | 'click_offer' | 'click_compare' | 'favorite';
  price?: number;
  duration_seconds?: number;
}

interface ConversionStats {
  totalViews: number;
  totalClicks: number;
  conversionRate: number;
  avgTimeSpent: number;
  topAgencies: Array<{ agency: string; clicks: number }>;
}

/**
 * Hook pour tracker les conversions et interactions utilisateur
 * Utilise localStorage + Google Analytics (pas de DB pour l'instant)
 */
export const useConversionTracking = () => {
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [sessionStart] = useState(Date.now());

  /**
   * Enregistre un événement de conversion dans localStorage
   */
  const trackEvent = useCallback((event: ConversionEvent) => {
    try {
      const events = JSON.parse(localStorage.getItem('conversion_events') || '[]');
      events.push({
        ...event,
        timestamp: Date.now(),
        session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
      });
      
      // Garder seulement les 30 derniers jours
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const filtered = events.filter((e: any) => e.timestamp > thirtyDaysAgo);
      
      localStorage.setItem('conversion_events', JSON.stringify(filtered.slice(-1000))); // Max 1000 events
      
      // Store session ID
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', crypto.randomUUID());
      }
    } catch (error) {
      console.error('Erreur tracking event:', error);
    }
  }, []);

  /**
   * Track vue d'offre
   */
  const trackOfferView = useCallback((offerId: string, agencyName: string, price?: number) => {
    trackEvent({
      offer_id: offerId,
      agency_name: agencyName,
      event_type: 'view',
      price,
    });
  }, [trackEvent]);

  /**
   * Track clic sur "Voir l'offre"
   */
  const trackOfferClick = useCallback((offerId: string, agencyName: string, price?: number) => {
    const timeSpent = Math.floor((Date.now() - sessionStart) / 1000);
    
    trackEvent({
      offer_id: offerId,
      agency_name: agencyName,
      event_type: 'click_offer',
      price,
      duration_seconds: timeSpent,
    });

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'click_offer', {
        event_category: 'Conversion',
        event_label: agencyName,
        value: price,
      });
    }
  }, [trackEvent, sessionStart]);

  /**
   * Track ajout aux favoris
   */
  const trackFavorite = useCallback((offerId: string, agencyName: string) => {
    trackEvent({
      offer_id: offerId,
      agency_name: agencyName,
      event_type: 'favorite',
    });
  }, [trackEvent]);

  /**
   * Track clic comparaison agences
   */
  const trackCompareClick = useCallback((offerId: string, agencyName: string) => {
    trackEvent({
      offer_id: offerId,
      agency_name: agencyName,
      event_type: 'click_compare',
    });
  }, [trackEvent]);

  /**
   * Charger les statistiques de conversion depuis localStorage
   */
  const loadStats = useCallback(() => {
    try {
      const events = JSON.parse(localStorage.getItem('conversion_events') || '[]');

      const views = events.filter((e: any) => e.event_type === 'view').length || 0;
      const clicks = events.filter((e: any) => e.event_type === 'click_offer').length || 0;
      
      // Calculer conversion rate
      const conversionRate = views > 0 ? (clicks / views) * 100 : 0;

      // Temps moyen passé
      const durations = events.filter((e: any) => e.duration_seconds).map((e: any) => e.duration_seconds) || [];
      const avgTimeSpent = durations.length > 0 
        ? durations.reduce((a: number, b: number) => a + b, 0) / durations.length 
        : 0;

      // Top agences par clics
      const agencyClicks: Record<string, number> = {};
      events.filter((e: any) => e.event_type === 'click_offer').forEach((e: any) => {
        agencyClicks[e.agency_name] = (agencyClicks[e.agency_name] || 0) + 1;
      });

      const topAgencies = Object.entries(agencyClicks)
        .map(([agency, clicks]) => ({ agency, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      setStats({
        totalViews: views,
        totalClicks: clicks,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgTimeSpent: Math.round(avgTimeSpent),
        topAgencies,
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  }, []);

  return {
    trackOfferView,
    trackOfferClick,
    trackFavorite,
    trackCompareClick,
    stats,
    refreshStats: loadStats,
  };
};

// Déclarer gtag pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
