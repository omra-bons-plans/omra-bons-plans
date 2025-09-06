import { supabase } from '@/integrations/supabase/client';

export const useClickTracking = () => {
  const trackClick = async (adId: string, clickType: 'ad_view' | 'contact_view') => {
    try {
      // Obtenir l'adresse IP et user agent côté client
      const userAgent = navigator.userAgent;
      
      // Récupérer l'utilisateur actuel s'il est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('click_stats')
        .insert({
          ad_id: adId,
          user_id: user?.id || null,
          click_type: clickType,
          user_agent: userAgent,
          // Note: ip_address sera null côté client pour des raisons de sécurité
        });

      if (error) {
        console.error('Erreur lors du tracking du clic:', error);
      }
    } catch (error) {
      console.error('Erreur lors du tracking du clic:', error);
    }
  };

  return { trackClick };
};