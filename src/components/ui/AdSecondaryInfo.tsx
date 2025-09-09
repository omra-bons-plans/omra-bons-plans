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
    <div className="space-y-4">
      {/* Ad Information */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <Eye className="w-4 h-4 mr-2 text-primary" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Publié</span>
            </div>
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(ad.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Expire le</span>
            </div>
            <span className="text-sm font-medium">
              {new Date(ad.publish_end_date).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <Star className="w-4 h-4 mr-2 text-primary" />
              Avis des utilisateurs
            </CardTitle>
            <RatingDisplay stats={stats} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          {stats.totalReviews > 0 ? (
            <div className="space-y-4">
              <ReviewsList
                reviews={reviews}
                loading={reviewsLoading}
                onEditReview={onEditReview}
                onDeleteReview={onDeleteReview}
              />
              
              {(canReview || canEditReview) && (
                <div className="border-t border-border/20 pt-4">
                  {!showReviewForm ? (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full rounded-xl h-10"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {canEditReview ? 'Modifier mon avis' : 'Laisser un avis'}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
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
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="text-base font-medium mb-2">Aucun avis pour le moment</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Soyez le premier à laisser un avis sur cette annonce !
              </p>
              
              {canReview && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="rounded-xl"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Laisser le premier avis
                </Button>
              )}
              
              {showReviewForm && canReview && (
                <div className="mt-4 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Laisser un avis</h4>
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
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <User className="w-4 h-4 mr-2 text-primary" />
            Annonceur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-base">
                {ad.profile?.full_name || ad.profile?.first_name || 'Utilisateur'}
              </h4>
              <p className="text-muted-foreground text-sm">
                Membre depuis {formatDistanceToNow(new Date(ad.created_at), { locale: fr })}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                Membre vérifié ✓
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};