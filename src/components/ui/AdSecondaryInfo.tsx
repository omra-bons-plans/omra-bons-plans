import { Calendar, Eye, User, Star, MessageCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ReviewsList } from './ReviewsList';
import { ReviewForm } from './ReviewForm';
import { RatingDisplay } from './RatingDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AdSecondaryInfoProps {
  ad: {
    created_at: string;
    publish_end_date: string;
    profile?: {
      full_name?: string;
      first_name?: string;
    };
  };
  reviews: any[];
  stats: {
    totalReviews: number;
    averageRating: number;
  };
  reviewsLoading: boolean;
  user?: any;
  canReview: boolean;
  canEditReview: boolean;
  userReview?: any;
  onSubmitReview: (rating: number, comment: string) => Promise<boolean>;
  onEditReview: () => void;
  onDeleteReview: (reviewId: string) => Promise<void>;
  showReviewForm: boolean;
  setShowReviewForm: (show: boolean) => void;
}

export const AdSecondaryInfo = ({
  ad,
  reviews,
  stats,
  reviewsLoading,
  user,
  canReview,
  canEditReview,
  userReview,
  onSubmitReview,
  onEditReview,
  onDeleteReview,
  showReviewForm,
  setShowReviewForm
}: AdSecondaryInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Ad Information */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Eye className="w-5 h-5 mr-2 text-primary" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border/20">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Publié</span>
            </div>
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(ad.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">Expire le</span>
            </div>
            <span className="text-sm font-medium">
              {new Date(ad.publish_end_date).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Star className="w-5 h-5 mr-2 text-primary" />
              Avis des utilisateurs
            </CardTitle>
            <RatingDisplay stats={stats} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          {stats.totalReviews > 0 ? (
            <div className="space-y-6">
              <ReviewsList
                reviews={reviews}
                loading={reviewsLoading}
                onEditReview={onEditReview}
                onDeleteReview={onDeleteReview}
              />
              
              {(canReview || canEditReview) && (
                <div className="border-t border-border/20 pt-6">
                  {!showReviewForm ? (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full rounded-xl h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {canEditReview ? 'Modifier mon avis' : 'Laisser un avis'}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {canEditReview ? 'Modifier votre avis' : 'Laisser un avis'}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                      <ReviewForm
                        onSubmit={onSubmitReview}
                        existingReview={userReview}
                        loading={reviewsLoading}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Aucun avis pour le moment</h4>
              <p className="text-muted-foreground mb-6">
                Soyez le premier à laisser un avis sur cette annonce !
              </p>
              
              {canReview && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Laisser le premier avis
                </Button>
              )}
              
              {showReviewForm && canReview && (
                <div className="mt-6 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Laisser un avis</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                  <ReviewForm
                    onSubmit={onSubmitReview}
                    existingReview={userReview}
                    loading={reviewsLoading}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <User className="w-5 h-5 mr-2 text-primary" />
            Annonceur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">
                {ad.profile?.full_name || ad.profile?.first_name || 'Utilisateur'}
              </h4>
              <p className="text-muted-foreground">
                Membre depuis {formatDistanceToNow(new Date(ad.created_at), { locale: fr })}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                Membre vérifié ✓
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};