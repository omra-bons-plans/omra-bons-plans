import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star, Phone, Mail, MessageCircle, Facebook, Instagram, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MobileLayout from '@/components/mobile/MobileLayout';

interface AdDetailsData {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  location?: string;
  coverImage?: string;
  images: string[];
  isPublished: boolean;
  publishEndDate: string;
  promotionEndDate?: string;
  createdAt: string;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
  user?: {
    email?: string;
    full_name?: string;
    phone?: string;
    phone_country?: string;
    whatsapp?: string;
    whatsapp_country?: string;
    professional_phone?: string;
    professional_phone_country?: string;
    facebook?: string;
    instagram?: string;
  };
  categoryDetails?: any;
}

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ad, setAd] = useState<AdDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userCategories, setUserCategories] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchAdDetails();
    }
  }, [id]);

  const fetchAdDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Fetch ad details with user profile
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (adError) throw adError;

      // Fetch user profile separately
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adData.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Fetch all published categories for this user to show "également" services
      const { data: userAds, error: userAdsError } = await supabase
        .from('ads')
        .select('category')
        .eq('user_id', adData.user_id)
        .eq('is_published', true)
        .neq('id', id); // Exclude current ad

      if (!userAdsError && userAds) {
        const categories = [...new Set(userAds.map(userAd => userAd.category))];
        setUserCategories(categories);
      }

      // Fetch category-specific details
      let categoryDetails = null;
      const tableMap: Record<string, string> = {
        'sejours': 'ads_sejours',
        'vols': 'ads_vols',
        'guides': 'ads_guides',
        'chauffeurs': 'ads_chauffeurs',
        'babysitting': 'ads_babysitting',
        'hebergement': 'ads_hebergements'
      };

      const categoryTable = tableMap[adData.category];
      if (categoryTable) {
        const { data: details, error: detailsError } = await supabase
          .from(categoryTable as any)
          .select('*')
          .eq('ad_id', id)
          .single();

        if (!detailsError) {
          categoryDetails = details;
        }
      }

      setAd({
        id: adData.id,
        title: adData.title,
        description: adData.description,
        price: adData.price,
        originalPrice: adData.original_price,
        category: adData.category,
        location: adData.location,
        coverImage: adData.cover_image,
        images: adData.images || [],
        isPublished: adData.is_published,
        publishEndDate: adData.publish_end_date,
        promotionEndDate: adData.promotion_end_date,
        createdAt: adData.created_at,
        showEmail: adData.show_email,
        showPhone: adData.show_phone,
        showWhatsapp: adData.show_whatsapp,
        showProfessionalPhone: adData.show_professional_phone,
        user: profile,
        categoryDetails
      });
    } catch (error) {
      console.error('Error fetching ad details:', error);
      toast.error('Erreur lors du chargement de l\'annonce');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    const categories = {
      sejours: 'Séjour',
      vols: 'Vol',
      guides: 'Guide',
      chauffeurs: 'Chauffeur',
      babysitting: 'Baby-sitting',
      hebergement: 'Hébergement'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const getAdditionalServices = () => {
    if (!ad || userCategories.length === 0) return '';
    
    const categoryNames: Record<string, string> = {
      'guides': 'guide',
      'chauffeurs': 'chauffeur',
      'babysitting': 'baby-sitter',
      'sejours': 'organisateur de séjours',
      'vols': 'spécialiste vols',
      'hebergement': 'hébergeur'
    };

    const additionalServices = userCategories
      .filter(cat => cat !== ad.category)
      .map(cat => categoryNames[cat] || cat)
      .join(', ');

    return additionalServices ? `(je suis également ${additionalServices})` : '';
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!ad) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Annonce non trouvée</h2>
            <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const allImages = ad.coverImage ? [ad.coverImage, ...ad.images] : ad.images;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/?category=${ad.category}`)}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {getCategoryName(ad.category)}s
            </button>
            <span>/</span>
            <span className="text-foreground">{ad.title}</span>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {/* Title and Contact Button Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
                {getAdditionalServices() && (
                  <p className="text-muted-foreground text-lg">
                    {getAdditionalServices()}
                  </p>
                )}
              </div>
              
              {/* Contact Button - Desktop */}
              <div className="hidden lg:block">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-600 hover:bg-slate-700 px-8">
                      Voir contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {ad.showEmail && ad.user?.email && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <span>{ad.user.email}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(ad.user?.email || '')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {ad.user?.facebook && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Facebook className="w-5 h-5 text-muted-foreground" />
                            <span>{ad.user.facebook}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://facebook.com/${ad.user?.facebook}`, '_blank')}
                          >
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </Button>
                        </div>
                      )}

                      {ad.user?.instagram && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Instagram className="w-5 h-5 text-muted-foreground" />
                            <span>{ad.user.instagram}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://instagram.com/${ad.user?.instagram}`, '_blank')}
                          >
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </Button>
                        </div>
                      )}

                      {ad.showWhatsapp && ad.user?.whatsapp && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-muted-foreground" />
                            <span>{ad.user.whatsapp_country}{ad.user.whatsapp}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(`${ad.user?.whatsapp_country}${ad.user?.whatsapp}` || '')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {ad.showPhone && ad.user?.phone && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <span>{ad.user.phone_country}{ad.user.phone}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(`${ad.user?.phone_country}${ad.user?.phone}` || '')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Main Layout - Desktop: Two columns, Mobile: Single column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Image and Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Carousel */}
                <div className="relative">
                  {allImages.length > 0 ? (
                    <>
                      <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={allImages[currentImageIndex].startsWith('http') 
                            ? allImages[currentImageIndex]
                            : `https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/ad-images/${allImages[currentImageIndex]}`
                          } 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/ad-placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      {/* Image indicators */}
                      {allImages.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          {allImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      <img 
                        src="/ad-placeholder.jpg"
                        alt="Aucune image disponible"
                        className="w-full h-full object-cover opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {ad.category === 'guides' ? 'Informations complémentaires' : 'Description'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed">{ad.description}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Info Cards */}
              <div className="space-y-6">
                {/* Mobile Contact Button */}
                <div className="lg:hidden">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-slate-600 hover:bg-slate-700">
                        Voir contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {ad.showEmail && ad.user?.email && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-muted-foreground" />
                              <span>{ad.user.email}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(ad.user?.email || '')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {ad.user?.facebook && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Facebook className="w-5 h-5 text-muted-foreground" />
                              <span>{ad.user.facebook}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(`https://facebook.com/${ad.user?.facebook}`, '_blank')}
                            >
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Button>
                          </div>
                        )}

                        {ad.user?.instagram && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Instagram className="w-5 h-5 text-muted-foreground" />
                              <span>{ad.user.instagram}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(`https://instagram.com/${ad.user?.instagram}`, '_blank')}
                            >
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Button>
                          </div>
                        )}

                        {ad.showWhatsapp && ad.user?.whatsapp && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-5 h-5 text-muted-foreground" />
                              <span>{ad.user.whatsapp_country}{ad.user.whatsapp}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(`${ad.user?.whatsapp_country}${ad.user?.whatsapp}` || '')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {ad.showPhone && ad.user?.phone && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-muted-foreground" />
                              <span>{ad.user.phone_country}{ad.user.phone}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(`${ad.user?.phone_country}${ad.user?.phone}` || '')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Price */}
                {ad.price > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">€ {ad.price}€</span>
                        {ad.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {ad.originalPrice}€
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Location */}
                {ad.location && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ville</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span>{ad.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Experience for guides */}
                {ad.categoryDetails && ad.category === 'guides' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Expérience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <span>{ad.categoryDetails.years_experience} ans</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Languages */}
                {ad.categoryDetails && ad.category === 'guides' && ad.categoryDetails.languages && ad.categoryDetails.languages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Langues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {ad.categoryDetails.languages.map((lang: string, index: number) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Services for guides */}
                {ad.categoryDetails && ad.category === 'guides' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Service proposé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {ad.categoryDetails.offers_omra_guidance && <li>• Omra</li>}
                        {ad.categoryDetails.offers_courses && <li>• Cours</li>}
                        {ad.categoryDetails.offers_visits && <li>• Visite des lieux</li>}
                        {ad.categoryDetails.offers_omra_badal && <li>• Omra badel</li>}
                        {ad.categoryDetails.offers_other && <li>• Autres</li>}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AdDetails;