import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ThreadedChatMessage {
  id: string;
  message: string;
  user_id: string;
  topic_id: string | null;
  parent_id: string | null;
  mentions: string[];
  created_at: string;
  updated_at: string;
  user_name?: string;
  kuniya?: string;
  company_name?: string;
  is_professional?: boolean;
  replies?: ThreadedChatMessage[];
}

interface Profile {
  id: string;
  full_name: string | null;
  first_name: string | null;
  kuniya: string | null;
  company_name: string | null;
  is_professional: boolean | null;
}

export const useThreadedChat = (topicId?: string) => {
  const [messages, setMessages] = useState<ThreadedChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch messages for topic
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (topicId) {
        query = query.eq('topic_id', topicId);
      } else {
        query = query.is('topic_id', null);
      }

      const { data: messagesData, error: messagesError } = await query;

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

        // Build threaded structure
        const threadedMessages = buildThreadStructure(messagesWithNames);
        setMessages(threadedMessages);
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

  // Build thread structure
  const buildThreadStructure = (messages: ThreadedChatMessage[]): ThreadedChatMessage[] => {
    const messageMap = new Map<string, ThreadedChatMessage>();
    const rootMessages: ThreadedChatMessage[] = [];

    // First pass: create map of all messages
    messages.forEach(msg => {
      messageMap.set(msg.id, { ...msg, replies: [] });
    });

    // Second pass: organize into threads
    messages.forEach(msg => {
      const message = messageMap.get(msg.id)!;
      
      if (msg.parent_id) {
        const parent = messageMap.get(msg.parent_id);
        if (parent) {
          parent.replies!.push(message);
        } else {
          rootMessages.push(message);
        }
      } else {
        rootMessages.push(message);
      }
    });

    return rootMessages;
  };

  // Send message
  const sendMessage = async (
    message: string, 
    parentId?: string, 
    mentions: string[] = []
  ) => {
    if (!user || !message.trim()) return false;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            message: message.trim(),
            user_id: user.id,
            topic_id: topicId || null,
            parent_id: parentId || null,
            mentions
          }
        ]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      return false;
    }
  };

  // Delete message (admin only)
  const deleteMessage = async (messageId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      toast.success('Message supprimé');
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Erreur lors de la suppression du message');
      return false;
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('threaded_chat_messages')
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
  }, [topicId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage
  };
};