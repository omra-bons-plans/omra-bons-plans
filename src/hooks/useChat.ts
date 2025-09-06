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
}

interface Profile {
  id: string;
  full_name: string | null;
  first_name: string | null;
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
          .select('id, full_name, first_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Create user lookup map
        const userLookup = (profilesData as Profile[])?.reduce((acc, profile) => {
          acc[profile.id] = profile.full_name || profile.first_name || 'Utilisateur';
          return acc;
        }, {} as Record<string, string>) || {};

        // Combine messages with user names
        const messagesWithNames = messagesData.map(msg => ({
          ...msg,
          user_name: userLookup[msg.user_id] || 'Utilisateur'
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
    sendMessage
  };
};