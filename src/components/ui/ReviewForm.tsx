import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Textarea } from './textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/hooks/useReviews';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<boolean>;
  existingReview?: Review | null;
  loading?: boolean;
}

export const ReviewForm = ({ onSubmit, existingReview, loading }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Connectez-vous pour laisser un avis</h3>
          <p className="text-muted-foreground">
            Vous devez être connecté pour pouvoir laisser un avis sur cette annonce.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    setSubmitting(true);
    const success = await onSubmit(rating, comment);
    
    if (success && !existingReview) {
      // Reset form only for new reviews
      setRating(0);
      setComment('');
    }
    
    setSubmitting(false);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {rating}/5 étoiles
          </span>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {existingReview ? 'Modifier votre avis' : 'Laisser un avis'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Note <span className="text-destructive">*</span>
            </label>
            {renderStars()}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Commentaire (optionnel)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 caractères
            </p>
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || submitting || loading}
            className="w-full"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {existingReview ? 'Modification...' : 'Publication...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {existingReview ? 'Modifier l\'avis' : 'Publier l\'avis'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};