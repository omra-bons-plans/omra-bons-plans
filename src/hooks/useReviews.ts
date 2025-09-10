import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ReviewReply {
  id: string;
  review_id: string;
  ad_owner_id: string;
  reply_text: string;
  created_at: string;
  updated_at: string;
  owner_name?: string;
}

export interface Review {
  id: string;
  ad_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name?: string;
  reply?: ReviewReply;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export const useReviews = (adId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    if (!adId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch reviews first
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('ad_id', adId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch review replies
      const reviewIds = reviewsData?.map(review => review.id) || [];
      const { data: repliesData } = await supabase
        .from('review_replies')
        .select('*')
        .in('review_id', reviewIds);

      // Fetch profiles for reviewers and reply authors
      const reviewerIds = reviewsData?.map(review => review.reviewer_id) || [];
      const replyAuthorIds = repliesData?.map(reply => reply.ad_owner_id) || [];
      const allUserIds = [...new Set([...reviewerIds, ...replyAuthorIds])];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, first_name')
        .in('id', allUserIds);

      // Format reviews with reviewer names and replies
      const formattedReviews = (reviewsData || []).map(review => {
        const profile = profiles?.find(p => p.id === review.reviewer_id);
        const reply = repliesData?.find(r => r.review_id === review.id);
        let formattedReply = undefined;
        
        if (reply) {
          const ownerProfile = profiles?.find(p => p.id === reply.ad_owner_id);
          formattedReply = {
            ...reply,
            owner_name: ownerProfile?.full_name || ownerProfile?.first_name || 'Propriétaire'
          };
        }

        return {
          ...review,
          reviewer_name: profile?.full_name || profile?.first_name || 'Anonyme',
          reply: formattedReply
        };
      });

      setReviews(formattedReviews);

      // Calculate stats
      if (formattedReviews.length > 0) {
        const totalRating = formattedReviews.reduce((sum, review) => sum + review.rating, 0);
        setStats({
          averageRating: Number((totalRating / formattedReviews.length).toFixed(1)),
          totalReviews: formattedReviews.length
        });
      } else {
        setStats({ averageRating: 0, totalReviews: 0 });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    if (!user || !adId) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return false;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          ad_id: adId,
          reviewer_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast.success('Votre avis a été ajouté avec succès');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err: any) {
      console.error('Error submitting review:', err);
      if (err.code === '23505') {
        toast.error('Vous avez déjà laissé un avis pour cette annonce');
      } else {
        toast.error('Erreur lors de l\'ajout de votre avis');
      }
      return false;
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour modifier un avis');
      return false;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment: comment.trim() || null
        })
        .eq('id', reviewId)
        .eq('reviewer_id', user.id);

      if (error) throw error;

      toast.success('Votre avis a été modifié avec succès');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      console.error('Error updating review:', err);
      toast.error('Erreur lors de la modification de votre avis');
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer un avis');
      return false;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('reviewer_id', user.id);

      if (error) throw error;

      toast.success('Votre avis a été supprimé');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Erreur lors de la suppression de votre avis');
      return false;
    }
  };

  const getUserReview = () => {
    if (!user) return null;
    return reviews.find(review => review.reviewer_id === user.id) || null;
  };

  useEffect(() => {
    fetchReviews();
  }, [adId]);

  const submitReply = async (reviewId: string, replyText: string) => {
    if (!user || !adId) {
      toast.error('Vous devez être connecté pour répondre');
      return false;
    }

    try {
      const { error } = await supabase
        .from('review_replies')
        .insert({
          review_id: reviewId,
          ad_owner_id: user.id,
          reply_text: replyText.trim()
        });

      if (error) throw error;

      toast.success('Votre réponse a été ajoutée avec succès');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      console.error('Error submitting reply:', err);
      toast.error('Erreur lors de l\'ajout de votre réponse');
      return false;
    }
  };

  const updateReply = async (replyId: string, replyText: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour modifier une réponse');
      return false;
    }

    try {
      const { error } = await supabase
        .from('review_replies')
        .update({
          reply_text: replyText.trim()
        })
        .eq('id', replyId)
        .eq('ad_owner_id', user.id);

      if (error) throw error;

      toast.success('Votre réponse a été modifiée avec succès');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      console.error('Error updating reply:', err);
      toast.error('Erreur lors de la modification de votre réponse');
      return false;
    }
  };

  const deleteReply = async (replyId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer une réponse');
      return false;
    }

    try {
      const { error } = await supabase
        .from('review_replies')
        .delete()
        .eq('id', replyId)
        .eq('ad_owner_id', user.id);

      if (error) throw error;

      toast.success('Votre réponse a été supprimée');
      fetchReviews(); // Refresh reviews
      return true;
    } catch (err) {
      console.error('Error deleting reply:', err);
      toast.error('Erreur lors de la suppression de votre réponse');
      return false;
    }
  };

  return {
    reviews,
    stats,
    loading,
    error,
    submitReview,
    updateReview,
    deleteReview,
    getUserReview,
    submitReply,
    updateReply,
    deleteReply,
    refetch: fetchReviews
  };
};