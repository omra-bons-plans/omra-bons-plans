import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_name: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      // First get chat messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(messagesData.map(msg => msg.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, first_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Map messages with user names
      const messagesWithNames = messagesData.map(msg => {
        const profile = profilesData?.find(p => p.id === msg.user_id);
        const userName = profile?.full_name || profile?.first_name || 'Utilisateur anonyme';
        
        return {
          ...msg,
          user_name: userName
        };
      });

      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!user || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            message: message.trim(),
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        async (payload) => {
          // Fetch user profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, first_name')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: ChatMessage = {
            id: payload.new.id,
            user_id: payload.new.user_id,
            message: payload.new.message,
            created_at: payload.new.created_at,
            user_name: profile?.full_name || profile?.first_name || 'Utilisateur anonyme'
          };

          setMessages(prev => [...prev, newMessage]);
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
    sendMessage,
  };
};