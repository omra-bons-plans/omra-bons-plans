import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Topic {
  id: string;
  title: string;
  description: string;
  theme: string;
  color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  message_count: number;
  last_message_at: string | null;
}

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch topics
  const fetchTopics = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('chat_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Erreur lors du chargement des sujets');
    } finally {
      setLoading(false);
    }
  };

  // Create topic
  const createTopic = async (topicData: {
    title: string;
    description?: string;
    theme: string;
    color?: string;
  }) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    try {
      const { error } = await supabase
        .from('chat_topics')
        .insert([
          {
            ...topicData,
            created_by: user.id
          }
        ]);

      if (error) throw error;
      
      toast.success('Sujet créé avec succès');
      return true;
    } catch (err) {
      console.error('Error creating topic:', err);
      toast.error('Erreur lors de la création du sujet');
      return false;
    }
  };

  // Delete topic (admin only)
  const deleteTopic = async (topicId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;
      
      toast.success('Sujet supprimé');
      return true;
    } catch (err) {
      console.error('Error deleting topic:', err);
      toast.error('Erreur lors de la suppression du sujet');
      return false;
    }
  };

  // Pin/unpin topic
  const togglePinTopic = async (topicId: string, isPinned: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_topics')
        .update({ is_pinned: !isPinned })
        .eq('id', topicId);

      if (error) throw error;
      
      toast.success(isPinned ? 'Sujet désépinglé' : 'Sujet épinglé');
      return true;
    } catch (err) {
      console.error('Error toggling pin topic:', err);
      toast.error('Erreur lors de la modification');
      return false;
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchTopics();

    const channel = supabase
      .channel('chat_topics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_topics'
        },
        () => {
          fetchTopics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    topics,
    loading,
    error,
    createTopic,
    deleteTopic,
    togglePinTopic,
    refetch: fetchTopics
  };
};