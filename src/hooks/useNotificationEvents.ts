import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  user_id: string;
  type: 'profile_view' | 'ad_comment' | 'contact_request' | 'ad_status_change' | 'ad_expiring' | 'system';
  title: string;
  message: string;
  related_id?: string;
  related_type?: string;
}

export const useNotificationEvents = () => {
  const createNotification = useCallback(async (params: CreateNotificationParams) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(params);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }, []);

  const notifyProfileView = useCallback(async (profileOwnerId: string, viewerName?: string) => {
    await createNotification({
      user_id: profileOwnerId,
      type: 'profile_view',
      title: 'Nouveau visiteur sur votre profil',
      message: viewerName 
        ? `${viewerName} a consulté votre profil`
        : 'Quelqu\'un a consulté votre profil',
      related_type: 'profile'
    });
  }, [createNotification]);

  const notifyContactRequest = useCallback(async (adOwnerId: string, adTitle: string, contactName?: string) => {
    await createNotification({
      user_id: adOwnerId,
      type: 'contact_request',
      title: 'Nouvelle demande de contact',
      message: contactName 
        ? `${contactName} souhaite vous contacter pour "${adTitle}"`
        : `Quelqu'un souhaite vous contacter pour "${adTitle}"`,
      related_type: 'ad'
    });
  }, [createNotification]);

  const notifyAdStatusChange = useCallback(async (adOwnerId: string, adTitle: string, status: string) => {
    const statusMessages = {
      published: 'Votre annonce a été publiée avec succès',
      rejected: 'Votre annonce a été rejetée',
      approved: 'Votre annonce a été approuvée',
      paused: 'Votre annonce a été mise en pause'
    };

    await createNotification({
      user_id: adOwnerId,
      type: 'ad_status_change',
      title: 'Changement de statut d\'annonce',
      message: `${statusMessages[status as keyof typeof statusMessages] || 'Statut mis à jour'} : "${adTitle}"`,
      related_type: 'ad'
    });
  }, [createNotification]);

  const notifyAdExpiring = useCallback(async (adOwnerId: string, adTitle: string, daysLeft: number) => {
    await createNotification({
      user_id: adOwnerId,
      type: 'ad_expiring',
      title: 'Annonce bientôt expirée',
      message: `Votre annonce "${adTitle}" expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
      related_type: 'ad'
    });
  }, [createNotification]);

  const notifySystem = useCallback(async (userId: string, title: string, message: string) => {
    await createNotification({
      user_id: userId,
      type: 'system',
      title,
      message
    });
  }, [createNotification]);

  return {
    notifyProfileView,
    notifyContactRequest,
    notifyAdStatusChange,
    notifyAdExpiring,
    notifySystem
  };
};