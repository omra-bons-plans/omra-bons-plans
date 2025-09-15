import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  kuniya?: string;
  company_name?: string;
  is_professional?: boolean;
}

interface Profile {
  id: string;
  full_name: string | null;
  first_name: string | null;
  kuniya: string | null;
  company_name: string | null;
  is_professional: boolean | null;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (messagesData && messagesData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
        
        // Get user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, first_name, kuniya, company_name, is_professional')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Create user lookup map
        const userLookup = (profilesData as Profile[])?.reduce((acc, profile) => {
          const displayName = profile.kuniya || profile.full_name || profile.first_name || 'Utilisateur';
          acc[profile.id] = {
            name: displayName,
            kuniya: profile.kuniya,
            company_name: profile.company_name,
            is_professional: profile.is_professional
          };
          return acc;
        }, {} as Record<string, any>) || {};

        // Combine messages with user info
        const messagesWithNames = messagesData.map(msg => ({
          ...msg,
          user_name: userLookup[msg.user_id]?.name || 'Utilisateur',
          kuniya: userLookup[msg.user_id]?.kuniya,
          company_name: userLookup[msg.user_id]?.company_name,
          is_professional: userLookup[msg.user_id]?.is_professional
        }));

        setMessages(messagesWithNames);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  // Delete message (admin only)
  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      // Admin peut supprimer n'importe quel message
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      // Recharger les messages après suppression
      fetchMessages();
      toast.success('Message supprimé');
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Erreur lors de la suppression du message');
    }
  };

  // Send message
  const sendMessage = async (message: string) => {
    if (!user || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            message: message.trim(),
            user_id: user.id
          }
        ]);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage
  };
};