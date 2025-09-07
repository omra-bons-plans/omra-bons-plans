import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Eye, Phone, MessageCircle, Star, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReviewsList } from '@/components/ui/ReviewsList';
import { ReviewForm } from '@/components/ui/ReviewForm';
import { RatingDisplay } from '@/components/ui/RatingDisplay';
import AdDetailsDisplay from '@/components/ui/AdDetailsDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AdData {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  category: string;
  images: string[];
  cover_image: string | null;
  created_at: string;
  user_id: string;
  is_published: boolean;
  publish_end_date: string;
  show_phone: boolean;
  show_whatsapp: boolean;
  show_email: boolean;
  original_price: number | null;
  is_promotion: boolean | null;
  promotion_end_date: string | null;
  categoryDetails?: any;
  profile?: {
    full_name: string;
    first_name: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
}

export default function AdDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  const {
    reviews,
    stats,
    loading: reviewsLoading,
    submitReview,
    updateReview,
    deleteReview,
    getUserReview
  } = useReviews(id);

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const fetchAdDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch ad first
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .single();

      if (adError) throw adError;

      if (!adData.is_published) {
        throw new Error('Cette annonce n\'est plus disponible');
      }

      // Fetch profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, first_name, phone, whatsapp, email')
        .eq('id', adData.user_id)
        .single();

      // Fetch category-specific details
      let categoryDetails = null;
      
      try {
        if (adData.category === 'sejours') {
          const { data } = await supabase
            .from('ads_sejours')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        } else if (adData.category === 'vols') {
          const { data } = await supabase
            .from('ads_vols')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        } else if (adData.category === 'hebergements') {
          const { data } = await supabase
            .from('ads_hebergements')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        } else if (adData.category === 'guides') {
          const { data } = await supabase
            .from('ads_guides')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        } else if (adData.category === 'chauffeurs') {
          const { data } = await supabase
            .from('ads_chauffeurs')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        } else if (adData.category === 'babysitting') {
          const { data } = await supabase
            .from('ads_babysitting')
            .select('*')
            .eq('ad_id', id)
            .single();
          categoryDetails = data;
        }
      } catch (err) {
        console.log('No category details found');
      }

      setAd({
        ...adData,
        categoryDetails,
        profile: profileData
      });

      // Track view (optional - you can implement this later)
      // trackAdView(id);

    } catch (error: any) {
      console.error('Error fetching ad details:', error);
      toast.error(error.message || 'Erreur lors du chargement de l\'annonce');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    const userReview = getUserReview();
    
    if (userReview) {
      // Update existing review
      const success = await updateReview(userReview.id, rating, comment);
      if (success) {
        setEditingReview(false);
        setShowReviewForm(false);
      }
      return success;
    } else {
      // Create new review
      const success = await submitReview(rating, comment);
      if (success) {
        setShowReviewForm(false);
      }
      return success;
    }
  };

  const handleEditReview = () => {
    setEditingReview(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
  };

  const handleShareAd = () => {
    if (navigator.share) {
      navigator.share({
        title: ad?.title,
        text: ad?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-96 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const userReview = getUserReview();
  const canReview = user && user.id !== ad.user_id && !userReview;
  const canEditReview = user && userReview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              const fromCategory = location.state?.fromCategory;
              if (fromCategory) {
                navigate(`/category/${fromCategory}`);
              } else {
                navigate('/');
              }
            }}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleShareAd}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ad Preview */}
            <Card>
              <CardContent className="p-6">
                <AdDetailsDisplay ad={ad} />
              </CardContent>
            </Card>

            {/* Reviews Section - Hidden on mobile, shown on desktop */}
            <Card className="hidden lg:block">
              <CardContent className="p-6">
                <Tabs defaultValue="reviews" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews">
                      Avis ({stats.totalReviews})
                    </TabsTrigger>
                    <TabsTrigger value="leave-review">
                      {canEditReview ? 'Modifier mon avis' : 'Laisser un avis'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Avis des utilisateurs
                        </h3>
                        <RatingDisplay stats={stats} size="lg" />
                      </div>

                      <ReviewsList
                        reviews={reviews}
                        loading={reviewsLoading}
                        onEditReview={handleEditReview}
                        onDeleteReview={handleDeleteReview}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="leave-review" className="mt-6">
                    {user && user.id === ad.user_id ? (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            Vous ne pouvez pas laisser d'avis
                          </h3>
                          <p className="text-muted-foreground">
                            Vous ne pouvez pas laisser un avis sur votre propre annonce.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <ReviewForm
                        onSubmit={handleReviewSubmit}
                        existingReview={userReview}
                        loading={reviewsLoading}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile: shows after ad preview, Desktop: shows on right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price & Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="space-y-2">
                    {/* Prix original barré si promotion */}
                    {ad.original_price && ad.original_price > ad.price && (
                      <div className="text-lg text-muted-foreground line-through">
                        {ad.original_price} {ad.currency}
                      </div>
                    )}
                    
                    {/* Prix actuel */}
                    <div className="text-3xl font-bold text-primary">
                      {ad.price === 0 && ['guides', 'chauffeurs', 'babysitting'].includes(ad.category) 
                        ? 'Me contacter' 
                        : `${ad.price} ${ad.currency}`}
                    </div>
                    
                    {/* Badge de réduction */}
                    {ad.original_price && ad.original_price > ad.price && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        -{Math.round(((ad.original_price - ad.price) / ad.original_price) * 100)}%
                      </Badge>
                    )}
                    
                    {/* Badge de promotion flash */}
                    {ad.is_promotion && ad.promotion_end_date && new Date(ad.promotion_end_date) > new Date() && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                        ⚡ Promotion Flash
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <RatingDisplay stats={stats} />
                  </div>
                </div>

                <div className="space-y-3">
                  {ad.show_phone && ad.profile?.phone && (
                    <Button className="w-full" variant="default">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                  )}
                  
                  {ad.show_whatsapp && ad.profile?.whatsapp && (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        const phoneNumber = ad.profile?.whatsapp?.replace(/[^\d]/g, '');
                        window.open(`https://wa.me/${phoneNumber}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ad Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{ad.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Publié {formatDistanceToNow(new Date(ad.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>Expire le {new Date(ad.publish_end_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Seller Info - Only visible on desktop */}
            <Card className="hidden lg:block">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Annonceur</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {ad.profile?.full_name || ad.profile?.first_name || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Membre depuis {formatDistanceToNow(new Date(ad.created_at), { locale: fr })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Reviews Section - Shows at bottom on mobile only */}
        <div className="lg:hidden mt-8 space-y-6">
          {/* Reviews Section */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reviews">
                    Avis ({stats.totalReviews})
                  </TabsTrigger>
                  <TabsTrigger value="leave-review">
                    {canEditReview ? 'Modifier mon avis' : 'Laisser un avis'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Avis des utilisateurs
                      </h3>
                      <RatingDisplay stats={stats} size="lg" />
                    </div>

                    <ReviewsList
                      reviews={reviews}
                      loading={reviewsLoading}
                      onEditReview={handleEditReview}
                      onDeleteReview={handleDeleteReview}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="leave-review" className="mt-6">
                  {user && user.id === ad.user_id ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Vous ne pouvez pas laisser d'avis
                        </h3>
                        <p className="text-muted-foreground">
                          Vous ne pouvez pas laisser un avis sur votre propre annonce.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <ReviewForm
                      onSubmit={handleReviewSubmit}
                      existingReview={userReview}
                      loading={reviewsLoading}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Mobile Seller Info - Shows at very bottom on mobile */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Annonceur</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">
                    {ad.profile?.full_name || ad.profile?.first_name || 'Utilisateur'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Membre depuis {formatDistanceToNow(new Date(ad.created_at), { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}