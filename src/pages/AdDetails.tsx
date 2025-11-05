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
import { ContactModal } from '@/components/ui/ContactModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import ResponsiveLayout from '@/components/ResponsiveLayout';

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
  show_professional_phone: boolean;
  original_price: number | null;
  is_promotion: boolean | null;
  promotion_end_date: string | null;
  categoryDetails?: any;
  profile?: {
    full_name: string;
    first_name: string;
    phone: string;
    whatsapp: string;
    professional_phone: string;
    email: string;
    phone_country: string;
    whatsapp_country: string;
    professional_phone_country: string;
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
    getUserReview,
    submitReply,
    updateReply,
    deleteReply
  } = useReviews(id);

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  // Helper functions for phone formatting
  const formatPhoneForCall = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) return '';
    // Remove leading zero from French numbers when adding country code
    const cleanPhone = phone.startsWith('0') && countryCode === '+33' 
      ? phone.slice(1) 
      : phone;
    return `${countryCode}${cleanPhone}`;
  };

  const formatPhoneForWhatsApp = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) return '';
    // Clean phone number (remove all non-digits)
    const cleanPhone = phone.replace(/[^\d]/g, '');
    // Remove leading zero for most country codes
    const phoneWithoutZero = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
    // Remove + from country code for WhatsApp
    const cleanCountryCode = countryCode.replace('+', '');
    return `${cleanCountryCode}${phoneWithoutZero}`;
  };

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
        .select('full_name, first_name, phone, whatsapp, professional_phone, email, phone_country, whatsapp_country, professional_phone_country')
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
        } else if (adData.category === 'hebergement' || adData.category === 'hebergements') {
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

  // Build structured data with optional fields
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ad.title,
    "description": ad.description,
    "image": ad.cover_image || ad.images[0],
    "offers": {
      "@type": "Offer",
      "price": ad.price,
      "priceCurrency": ad.currency,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": ad.publish_end_date,
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "FR",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "FR"
        },
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      }
    }
  };

  // Add aggregateRating if reviews exist
  if (stats.totalReviews > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": stats.averageRating,
      "reviewCount": stats.totalReviews
    };
  }

  // Add reviews if they exist
  if (reviews && reviews.length > 0) {
    structuredData.review = reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating
      },
      "author": {
        "@type": "Person",
        "name": review.reviewer_name || "Utilisateur"
      },
      "reviewBody": review.comment,
      "datePublished": review.created_at
    }));
  }

  // Add aggregateRating if reviews exist
  if (stats.totalReviews > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": stats.averageRating,
      "reviewCount": stats.totalReviews
    };
  }

  // Add reviews if they exist
  if (reviews && reviews.length > 0) {
    structuredData.review = reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating
      },
      "author": {
        "@type": "Person",
        "name": review.reviewer_name || "Utilisateur"
      },
      "reviewBody": review.comment,
      "datePublished": review.created_at
    }));
  }

  return (
    <ResponsiveLayout>
      <DynamicSEO
        title={`${ad.title} | Annonce Omra Hajj - Omra Bons Plans`}
        description={ad.description.substring(0, 160)}
        keywords={[ad.category, 'omra', 'hajj', ad.location]}
        type="product"
        image={ad.cover_image || ad.images[0] || undefined}
        path={`/ad/${id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Hidden H1 for SEO */}
          <h1 className="sr-only">{ad.title} - Annonce Omra Hajj</h1>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => {
                const fromCategory = location.state?.fromCategory;
                const fromAdmin = location.state?.fromAdmin;
                if (fromAdmin) {
                  navigate('/admin/ads');
                } else if (fromCategory && fromCategory !== 'all') {
                  navigate('/', { state: { selectedCategory: fromCategory } });
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
                        adOwnerId={ad?.user_id}
                        onEditReview={handleEditReview}
                        onDeleteReview={handleDeleteReview}
                        onSubmitReply={submitReply}
                        onUpdateReply={updateReply}
                        onDeleteReply={deleteReply}
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
                    {ad.original_price && ad.original_price > ad.price && (
                      (() => {
                        const discount = Math.round(((ad.original_price - ad.price) / ad.original_price) * 100);
                        const endDate = new Date(ad.publish_end_date);
                        const now = new Date();
                        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        
                        // Badge flash si réduction >= 30% et se termine dans 7 jours ou moins
                        if (discount >= 30 && daysLeft <= 7 && daysLeft > 0) {
                          return (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                              ⚡ Flash - {discount}%
                            </Badge>
                          );
                        }
                        return null;
                      })()
                    )}
                  </div>
                  <div className="mt-4">
                    <RatingDisplay stats={stats} />
                  </div>
                </div>

                <div className="space-y-3">
                  <ContactModal
                    contactInfo={{
                      email: ad.profile?.email,
                      phone: ad.profile?.phone,
                      whatsapp: ad.profile?.whatsapp,
                      professional_phone: ad.profile?.professional_phone,
                      phone_country: ad.profile?.phone_country,
                      whatsapp_country: ad.profile?.whatsapp_country,
                      professional_phone_country: ad.profile?.professional_phone_country,
                    }}
                    showOptions={{
                      show_email: ad.show_email,
                      show_phone: ad.show_phone,
                      show_whatsapp: ad.show_whatsapp,
                      show_professional_phone: ad.show_professional_phone,
                    }}
                    ownerName={ad.profile?.full_name || ad.profile?.first_name || 'Utilisateur'}
                    isAuthenticated={!!user}
                    adId={id!}
                  />
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
                      adOwnerId={ad?.user_id}
                      onEditReview={handleEditReview}
                      onDeleteReview={handleDeleteReview}
                      onSubmitReply={submitReply}
                      onUpdateReply={updateReply}
                      onDeleteReply={deleteReply}
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
    </ResponsiveLayout>
  );
}