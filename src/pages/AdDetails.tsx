import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Baby, Car, User, Plane, Home, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';

// Import new components
import { AdHeader } from '@/components/ui/AdHeader';
import { AdImageGallery } from '@/components/ui/AdImageGallery';
import { AdMainInfo } from '@/components/ui/AdMainInfo';
import { AdInfoTabs } from '@/components/ui/AdInfoTabs';
import { AdPriceAction } from '@/components/ui/AdPriceAction';
import { AdSecondaryInfo } from '@/components/ui/AdSecondaryInfo';

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

    } catch (error: any) {
      console.error('Error fetching ad details:', error);
      toast.error(error.message || 'Erreur lors du chargement de l\'annonce');
      window.location.href = '/';
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

  // Helper functions for category icons and names
  const getCategoryIcon = () => {
    if (!ad) return <User className="w-5 h-5" />;
    
    switch (ad.category) {
      case 'babysitting':
        return <Baby className="w-5 h-5" />;
      case 'chauffeurs':
        return <Car className="w-5 h-5" />;
      case 'guides':
        return <User className="w-5 h-5" />;
      case 'vols':
        return <Plane className="w-5 h-5" />;
      case 'hebergements':
        return <Home className="w-5 h-5" />;
      case 'sejours':
        return <Calendar className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getCategoryName = () => {
    if (!ad) return 'Service';
    
    switch (ad.category) {
      case 'babysitting':
        return 'Baby-sitting';
      case 'chauffeurs':
        return 'Chauffeur';
      case 'guides':
        return 'Guide';
      case 'vols':
        return 'Vol';
      case 'hebergements':
        return 'Hébergement';
      case 'sejours':
        return 'Séjour';
      default:
        return 'Service';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 pb-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-32 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!ad) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
          <p className="text-muted-foreground mb-6">
            Cette annonce n'existe pas ou a été supprimée.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Calculate discount and flash status
  const hasDiscount = ad.original_price && ad.original_price > ad.price;
  const discountPercent = hasDiscount 
    ? Math.round(((ad.original_price - ad.price) / ad.original_price) * 100) 
    : 0;
  const daysLeft = Math.ceil((new Date(ad.publish_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isFlash = hasDiscount && discountPercent >= 30 && daysLeft <= 7 && daysLeft > 0;

  const userReview = getUserReview();
  const canReview = user && user.id !== ad.user_id && !userReview;
  const canEditReview = user && !!userReview;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <AdHeader 
        title={ad.title} 
        description={ad.description} 
      />

      {/* Main Content */}
      <div className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Image Gallery */}
          <AdImageGallery
            images={ad.images || []}
            coverImage={ad.cover_image}
            title={ad.title}
            isPromotion={hasDiscount}
            discountPercent={discountPercent}
            isFlash={isFlash}
          />

          {/* Main Info */}
          <AdMainInfo
            title={ad.title}
            location={ad.location}
            category={ad.category}
            rating={{
              average: stats.averageRating,
              count: stats.totalReviews
            }}
            getCategoryIcon={getCategoryIcon}
            getCategoryName={getCategoryName}
          />

          {/* Description & Details Tabs */}
          <AdInfoTabs
            description={ad.description}
            category={ad.category}
            categoryDetails={ad.categoryDetails}
          />

          {/* Secondary Information */}
          <AdSecondaryInfo
            ad={ad}
            reviews={reviews}
            stats={stats}
            reviewsLoading={reviewsLoading}
            user={user}
            canReview={canReview}
            canEditReview={canEditReview}
            userReview={userReview}
            onSubmitReview={handleReviewSubmit}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
          />
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <AdPriceAction
        price={ad.price}
        currency={ad.currency}
        originalPrice={ad.original_price}
        category={ad.category}
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
        endDate={ad.publish_end_date}
      />
    </div>
  );
}