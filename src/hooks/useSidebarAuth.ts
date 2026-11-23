import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

export function useSidebarAuth() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { unreadCount } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getInitials = (email: string) =>
    email.split('@')[0].substring(0, 2).toUpperCase();

  return { user, isAdmin, unreadCount, handleSignOut, getInitials };
}
