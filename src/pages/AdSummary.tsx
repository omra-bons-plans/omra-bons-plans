import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Euro, Calendar, Play, Trash2, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MobileLayout from '@/components/mobile/MobileLayout';
import { getImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface AdDetails {
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
  isDraft: boolean;
  isPaused: boolean;
  isPromotion: boolean;
  publishEndDate: string;
  promotionEndDate?: string;
  createdAt: string;
  updatedAt: string;
  showEmail: boolean;
  showPhone: boolean;
  showWhatsapp: boolean;
  showProfessionalPhone: boolean;
}

const AdSummary = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState<AdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchAdDetails();
    }
  }, [user, id, navigate]);

  const fetchAdDetails = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setAd({
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.original_price,
        category: data.category,
        location: data.location,
        coverImage: data.cover_image,
        images: data.images || [],
        isPublished: data.is_published,
        isDraft: data.is_draft,
        isPaused: data.is_paused,
        isPromotion: data.is_promotion,
        publishEndDate: data.publish_end_date,
        promotionEndDate: data.promotion_end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        showEmail: data.show_email,
        showPhone: data.show_phone,
        showWhatsapp: data.show_whatsapp,
        showProfessionalPhone: data.show_professional_phone,
      });
    } catch (error) {
      console.error('Error fetching ad details:', error);
      toast.error('Erreur lors du chargement de l\'annonce');
      navigate('/my-ads');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePause = async () => {
    if (!ad) return;

    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('ads')
        .update({ is_paused: !ad.isPaused })
        .eq('id', ad.id);

      if (error) throw error;

      setAd({ ...ad, isPaused: !ad.isPaused });
      toast.success(ad.isPaused ? 'Annonce réactivée' : 'Annonce mise en pause');
    } catch (error) {
      console.error('Error toggling pause:', error);
      toast.error('Erreur lors de la modification');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!ad) return;

    try {
      setActionLoading(true);
      const publishEndDate = new Date();
      publishEndDate.setDate(publishEndDate.getDate() + 30); // 30 jours par défaut

      const { error } = await supabase
        .from('ads')
        .update({ 
          is_published: true, 
          is_draft: false,
          publish_end_date: publishEndDate.toISOString()
        })
        .eq('id', ad.id);

      if (error) throw error;

      setAd({ 
        ...ad, 
        isPublished: true, 
        isDraft: false,
        publishEndDate: publishEndDate.toISOString()
      });
      toast.success('Annonce publiée avec succès');
    } catch (error) {
      console.error('Error publishing ad:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!ad) return;

    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('ads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ad.id);

      if (error) throw error;

      toast.success('Brouillon enregistré');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    const categories = {
      sejours: 'Séjours',
      vols: 'Vols',
      guides: 'Guides',
      chauffeurs: 'Chauffeurs',
      babysitting: 'Baby-sitting',
      hebergement: 'Hébergement'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getStatusBadge = () => {
    if (!ad) return null;
    
    if (ad.isDraft) {
      return <Badge variant="secondary">Brouillon</Badge>;
    }
    if (ad.isPaused) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En pause</Badge>;
    }
    if (ad.isPublished) {
      return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    }
    return null;
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
            <Link to="/my-ads">
              <Button>Retour à mes annonces</Button>
            </Link>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/my-ads')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Mes annonces
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Title and Status */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <Badge variant="outline">{getCategoryName(ad.category)}</Badge>
                    {ad.isPromotion && (
                      <Badge className="bg-red-100 text-red-800">Promotion</Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  {ad.isDraft ? (
                    <>
                      <Button 
                        onClick={handlePublish}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Publier
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={actionLoading}
                      >
                        Enregistrer
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={handleTogglePause}
                      disabled={actionLoading}
                    >
                      {ad.isPaused ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Activer
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Mettre en pause
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/publish/${ad.category}?edit=${ad.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Images */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Cover Image */}
                      {ad.coverImage && (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <ImageWithFallback 
                            src={getImageUrl(ad.coverImage)} 
                            alt="Image de couverture"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Additional Images */}
                      {ad.images.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {ad.images.map((image, index) => (
                            <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <ImageWithFallback 
                                src={getImageUrl(image)} 
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {!ad.coverImage && ad.images.length === 0 && (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {ad.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Details Sidebar */}
              <div className="space-y-6">
                {/* Price */}
                {!['guides', 'chauffeurs', 'babysitting'].includes(ad.category) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-2xl font-bold">
                        <Euro className="w-6 h-6" />
                        <span>{ad.price}€</span>
                        {ad.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {ad.originalPrice}€
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Détails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ad.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span>{ad.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <span>Expire le {new Date(ad.publishEndDate).toLocaleDateString()}</span>
                    </div>

                    {ad.promotionEndDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <span className="text-red-600">
                          Promotion jusqu'au {new Date(ad.promotionEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Options de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <Badge variant={ad.showEmail ? "default" : "secondary"}>
                        {ad.showEmail ? 'Affiché' : 'Masqué'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Téléphone</span>
                      <Badge variant={ad.showPhone ? "default" : "secondary"}>
                        {ad.showPhone ? 'Affiché' : 'Masqué'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>WhatsApp</span>
                      <Badge variant={ad.showWhatsapp ? "default" : "secondary"}>
                        {ad.showWhatsapp ? 'Affiché' : 'Masqué'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Téléphone pro</span>
                      <Badge variant={ad.showProfessionalPhone ? "default" : "secondary"}>
                        {ad.showProfessionalPhone ? 'Affiché' : 'Masqué'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AdSummary;