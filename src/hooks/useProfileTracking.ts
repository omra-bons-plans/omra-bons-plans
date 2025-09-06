import { supabase } from '@/integrations/supabase/client';

export const useProfileTracking = () => {
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
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('profile_views')
        .eq('id', profileId)
        .single();

      if (currentProfile) {
        await supabase
          .from('profiles')
          .update({ profile_views: currentProfile.profile_views + 1 })
          .eq('id', profileId);
      }

    } catch (error) {
      console.error('Erreur lors du tracking de la vue du profil:', error);
    }
  };

  return { trackProfileView };
};