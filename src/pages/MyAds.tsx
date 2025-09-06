import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Pause, Play, Eye, Calendar, MapPin, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MobileLayout from '@/components/mobile/MobileLayout';
import { getImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { invalidateAdsCache } from '@/hooks/useAds';

interface UserAd {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  location?: string;
  coverImage?: string;
  isPublished: boolean;
  isDraft: boolean;
  isPaused: boolean;
  isPromotion: boolean;
  publishEndDate: string;
  promotionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

const MyAds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<UserAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserAds();
  }, [user, navigate]);

  const fetchUserAds = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedAds: UserAd[] = (data || []).map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        price: ad.price,
        originalPrice: ad.original_price,
        category: ad.category,
        location: ad.location,
        coverImage: ad.cover_image,
        isPublished: ad.is_published,
        isDraft: ad.is_draft,
        isPaused: ad.is_paused,
        isPromotion: ad.is_promotion,
        publishEndDate: ad.publish_end_date,
        promotionEndDate: ad.promotion_end_date,
        createdAt: ad.created_at,
        updatedAt: ad.updated_at,
      }));

      setAds(mappedAds);
    } catch (error) {
      console.error('Error fetching user ads:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!user) return;

    const ad = ads.find(a => a.id === adId);
    if (!ad) return;

    // Empêcher la suppression des annonces expirées
    if (isAdExpired(ad.publishEndDate)) {
      toast.error("Impossible de supprimer une annonce expirée. Seul un administrateur peut le faire.");
      return;
    }

    try {
      setActionLoading(adId);
      
      // Delete category-specific data first
      const ad = ads.find(a => a.id === adId);
      if (ad) {
        let categoryTable = '';
        switch (ad.category) {
          case 'sejours':
            categoryTable = 'ads_sejours';
            break;
          case 'vols':
            categoryTable = 'ads_vols';
            break;
          case 'guides':
            categoryTable = 'ads_guides';
            break;
          case 'chauffeurs':
            categoryTable = 'ads_chauffeurs';
            break;
          case 'babysitting':
            categoryTable = 'ads_babysitting';
            break;
          case 'hebergement':
            categoryTable = 'ads_hebergements';
            break;
        }
        
        if (categoryTable) {
          await supabase
            .from(categoryTable as any)
            .delete()
            .eq('ad_id', adId);
        }
      }

      // Delete the main ad
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setAds(prev => prev.filter(ad => ad.id !== adId));
      // Invalidate cache to refresh other pages
      invalidateAdsCache();
      toast.success('Annonce supprimée avec succès');
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePause = async (adId: string, currentPaused: boolean) => {
    try {
      setActionLoading(adId);
      
      const { error } = await supabase
        .from('ads')
        .update({ is_paused: !currentPaused })
        .eq('id', adId)
        .eq('user_id', user!.id);

      if (error) throw error;

      setAds(prev => prev.map(ad => 
        ad.id === adId ? { ...ad, isPaused: !currentPaused } : ad
      ));
      
      // Invalidate cache to refresh other pages
      invalidateAdsCache();
      toast.success(currentPaused ? 'Annonce réactivée' : 'Annonce mise en pause');
    } catch (error) {
      console.error('Error toggling pause:', error);
      toast.error('Erreur lors de la modification');
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'sejours': 'Séjour',
      'vols': 'Vol',
      'guides': 'Guide',
      'chauffeurs': 'Chauffeur',
      'babysitting': 'Baby-sitting',
      'hebergement': 'Hébergement'
    };
    return names[category] || 'Service';
  };

  const getStatusBadge = (ad: UserAd) => {
    if (ad.isDraft) {
      return <Badge variant="secondary">Brouillon</Badge>;
    }
    if (ad.isPaused) {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">En pause</Badge>;
    }
    if (!ad.isPublished) {
      return <Badge variant="destructive">Non publié</Badge>;
    }
    if (new Date(ad.publishEndDate) < new Date()) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Actif</Badge>;
  };

  // Fonction utilitaire pour vérifier si une annonce est expirée
  const isAdExpired = (publishEndDate: string): boolean => {
    return publishEndDate ? new Date(publishEndDate) <= new Date() : false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredAds = {
    all: ads,
    published: ads.filter(ad => ad.isPublished && !ad.isDraft && !ad.isPaused),
    drafts: ads.filter(ad => ad.isDraft),
    paused: ads.filter(ad => ad.isPaused),
    expired: ads.filter(ad => new Date(ad.publishEndDate) < new Date())
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

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Desktop Header */}
        <header className="hidden lg:block glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Accueil
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">Mes annonces</span>
              </div>
              
              <Link to="/publish">
                <Button className="bg-primary hover:bg-primary/90">
                  Créer une annonce
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-4 lg:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground mb-4"
              >
                ← Retour
              </Button>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mes annonces</h1>
                <Link to="/publish">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Créer
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop Title */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-4xl font-bold">Mes annonces</h1>
              <p className="text-muted-foreground mt-2">Gérez vos annonces publiées</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{filteredAds.all.length}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredAds.published.length}</div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-500">{filteredAds.drafts.length}</div>
                  <p className="text-sm text-muted-foreground">Brouillons</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{filteredAds.paused.length}</div>
                  <p className="text-sm text-muted-foreground">En pause</p>
                </CardContent>
              </Card>
            </div>

            {/* Ads List */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="all">Toutes ({filteredAds.all.length})</TabsTrigger>
                <TabsTrigger value="published">Actives ({filteredAds.published.length})</TabsTrigger>
                <TabsTrigger value="drafts">Brouillons ({filteredAds.drafts.length})</TabsTrigger>
                <TabsTrigger value="paused" className="hidden lg:block">En pause ({filteredAds.paused.length})</TabsTrigger>
                <TabsTrigger value="expired" className="hidden lg:block">Expirées ({filteredAds.expired.length})</TabsTrigger>
              </TabsList>

              {Object.entries(filteredAds).map(([key, adsToShow]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  {adsToShow.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold mb-2">
                          {key === 'drafts' ? 'Aucun brouillon' : 
                           key === 'published' ? 'Aucune annonce active' :
                           key === 'paused' ? 'Aucune annonce en pause' :
                           key === 'expired' ? 'Aucune annonce expirée' :
                           'Aucune annonce'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Commencez par créer votre première annonce
                        </p>
                        <Link to="/publish">
                          <Button>Créer une annonce</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {adsToShow.map((ad) => (
                        <Card key={ad.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Image */}
                              <div className="w-full lg:w-48 h-32 lg:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                {ad.coverImage ? (
                                   <ImageWithFallback 
                                     src={getImageUrl(ad.coverImage)} 
                                     alt={ad.title}
                                     className="w-full h-full object-cover"
                                   />
                                ) : (
                                   <ImageWithFallback 
                                     src="/ad-placeholder.jpg" 
                                     alt="Aucune image disponible"
                                     className="w-full h-full object-cover"
                                   />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-lg">{ad.title}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        {getCategoryName(ad.category)}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                      {ad.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(ad)}
                                    {ad.isPromotion && (
                                      <Badge className="bg-red-100 text-red-800 text-xs">
                                        Promotion
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  {ad.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{ad.location}</span>
                                    </div>
                                  )}
                                  {!['guides', 'chauffeurs', 'babysitting'].includes(ad.category) && (
                                    <div className="flex items-center gap-1">
                                      <Euro className="w-4 h-4" />
                                      <span>{ad.price}€</span>
                                      {ad.originalPrice && (
                                        <span className="line-through ml-1">{ad.originalPrice}€</span>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Expire le {formatDate(ad.publishEndDate)}</span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      if (ad.isPublished && !ad.isPaused && !ad.isDraft) {
                                        // Annonce active : aller vers l'annonce en ligne
                                        navigate(`/ad/${ad.id}`);
                                      } else {
                                        // Annonce en pause ou brouillon : aller vers la page récap
                                        navigate(`/ad-summary/${ad.id}`);
                                      }
                                    }}
                                    disabled={actionLoading === ad.id}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    {ad.isPublished && !ad.isPaused && !ad.isDraft ? 'Voir en ligne' : 'Voir le récap'}
                                  </Button>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      // Set edit mode in session storage
                                      sessionStorage.setItem('editingAdId', ad.id);
                                      sessionStorage.setItem('selectedCategory', ad.category);
                                      navigate(`/publish/${ad.category}?edit=${ad.id}`);
                                    }}
                                    disabled={actionLoading === ad.id}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Modifier
                                  </Button>

                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleTogglePause(ad.id, ad.isPaused)}
                                    disabled={actionLoading === ad.id || ad.isDraft}
                                  >
                                    {ad.isPaused ? (
                                      <>
                                        <Play className="w-4 h-4 mr-1" />
                                        Réactiver
                                      </>
                                    ) : (
                                      <>
                                        <Pause className="w-4 h-4 mr-1" />
                                        Mettre en pause
                                      </>
                                    )}
                                  </Button>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        disabled={actionLoading === ad.id || isAdExpired(ad.publishEndDate)}
                                        title={isAdExpired(ad.publishEndDate) ? "Impossible de supprimer une annonce expirée" : ""}
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Supprimer
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer l'annonce "{ad.title}" ? 
                                          Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteAd(ad.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MyAds;