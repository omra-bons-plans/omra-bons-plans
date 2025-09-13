import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TopicRequest {
  id: string;
  title: string;
  description: string;
  theme: string;
  justification: string;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useTopicRequests = () => {
  const [requests, setRequests] = useState<TopicRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch topic requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('topic_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as TopicRequest[]);
    } catch (err) {
      console.error('Error fetching topic requests:', err);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  // Create topic request
  const createTopicRequest = async (requestData: {
    title: string;
    description?: string;
    theme: string;
    justification?: string;
  }) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return false;
    }

    try {
      const { error } = await supabase
        .from('topic_requests')
        .insert([
          {
            ...requestData,
            requested_by: user.id
          }
        ]);

      if (error) throw error;
      
      toast.success('Demande de sujet envoyée avec succès');
      return true;
    } catch (err) {
      console.error('Error creating topic request:', err);
      toast.error('Erreur lors de l\'envoi de la demande');
      return false;
    }
  };

  // Approve topic request and create topic
  const approveTopicRequest = async (requestId: string, requestData: TopicRequest) => {
    if (!user) return false;

    try {
      // Create the actual topic
      const { error: topicError } = await supabase
        .from('chat_topics')
        .insert([
          {
            title: requestData.title,
            description: requestData.description,
            theme: requestData.theme,
            created_by: user.id
          }
        ]);

      if (topicError) throw topicError;

      // Update request status
      const { error: updateError } = await supabase
        .from('topic_requests')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;
      
      toast.success('Sujet approuvé et créé avec succès');
      return true;
    } catch (err) {
      console.error('Error approving topic request:', err);
      toast.error('Erreur lors de l\'approbation');
      return false;
    }
  };

  // Reject topic request
  const rejectTopicRequest = async (requestId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('topic_requests')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Demande rejetée');
      return true;
    } catch (err) {
      console.error('Error rejecting topic request:', err);
      toast.error('Erreur lors du rejet');
      return false;
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('topic_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'topic_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    requests,
    loading,
    error,
    createTopicRequest,
    approveTopicRequest,
    rejectTopicRequest,
    refetch: fetchRequests
  };
};