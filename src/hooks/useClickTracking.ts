import { supabase } from '@/integrations/supabase/client';
import { useNotificationEvents } from './useNotificationEvents';

export const useClickTracking = () => {
  const { notifyContactRequest } = useNotificationEvents();

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

      // Create notification for contact views
      if (clickType === 'contact_view' && user) {
        // Get ad and owner info
        const { data: ad } = await supabase
          .from('ads')
          .select('title, user_id')
          .eq('id', adId)
          .single();

        if (ad && ad.user_id !== user.id) {
          // Get contact requester name
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('full_name, first_name')
            .eq('id', user.id)
            .single();

          const contactName = userProfile?.full_name || userProfile?.first_name;
          await notifyContactRequest(ad.user_id, ad.title, contactName);
        }
      }
    } catch (error) {
      console.error('Erreur lors du tracking du clic:', error);
    }
  };

  return { trackClick };
};