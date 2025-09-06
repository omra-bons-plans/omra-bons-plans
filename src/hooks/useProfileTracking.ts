import { supabase } from '@/integrations/supabase/client';
import { useNotificationEvents } from './useNotificationEvents';

export const useProfileTracking = () => {
  const { notifyProfileView } = useNotificationEvents();

  const trackProfileView = async (profileId: string) => {
    try {
      // Obtenir l'user agent côté client
      const userAgent = navigator.userAgent;
      
      // Récupérer l'utilisateur actuel s'il est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profile_views')
        .insert({
          profile_id: profileId,
          viewer_id: user?.id || null,
          user_agent: userAgent,
          // Note: ip_address sera null côté client pour des raisons de sécurité
        });

      if (error) {
        console.error('Erreur lors du tracking de la vue du profil:', error);
      }

      // Incrémenter le compteur de vues du profil
      const { data } = await supabase
        .rpc('increment_profile_views', { profile_id: profileId });

      if (data !== null) {
        console.log(`Profile views incremented to: ${data}`);
      }

      // Create notification if viewer is different from profile owner
      if (user && user.id !== profileId) {
        // Get viewer profile for name
        const { data: viewerProfile } = await supabase
          .from('profiles')
          .select('full_name, first_name')
          .eq('id', user.id)
          .single();

        const viewerName = viewerProfile?.full_name || viewerProfile?.first_name;
        await notifyProfileView(profileId, viewerName);
      }

    } catch (error) {
      console.error('Erreur lors du tracking de la vue du profil:', error);
    }
  };

  return { trackProfileView };
};