import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Mail, MessageCircle, Facebook, Instagram, Eye, Calendar, Languages, User, Building, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useClickTracking } from '@/hooks/useClickTracking';

interface UserProfile {
  id: string;
  slug: string;
  full_name?: string;
  first_name?: string;
  kuniya?: string;
  email?: string;
  phone?: string;
  phone_country?: string;
  whatsapp?: string;
  whatsapp_country?: string;
  professional_phone?: string;
  professional_phone_country?: string;
  company_name?: string;
  company_address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  is_professional?: boolean;
  public_profile: boolean;
  bio?: string;
  specialties: string[];
  experience_years?: number;
  profile_views: number;
  profile_image?: string;
  languages_spoken: string[];
  created_at: string;
}

interface UserAd {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location?: string;
  cover_image?: string;
  is_published: boolean;
  created_at: string;
  ad_views: number;
  contact_views: number;
}

const PublicProfile = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { trackClick } = useClickTracking();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userAds, setUserAds] = useState<UserAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAds: 0,
    totalViews: 0,
    totalContacts: 0,
    categories: [] as string[]
  });

  useEffect(() => {
    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // Track profile view when component mounts and profile is loaded
  useEffect(() => {
    if (profile) {
      trackProfileView();
    }
  }, [profile]);

  const trackProfileView = async () => {
    if (!profile) return;
    
    try {
      const userAgent = navigator.userAgent;
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profile_views')
        .insert({
          profile_id: profile.id,
          viewer_id: user?.id || null,
          user_agent: userAgent,
        });

      if (error) {
        console.error('Erreur lors du tracking de la vue du profil:', error);
      }

      // Incrémenter le compteur de vues du profil
      await supabase
        .from('profiles')
        .update({ profile_views: profile.profile_views + 1 })
        .eq('id', profile.id);

    } catch (error) {
      console.error('Erreur lors du tracking de la vue du profil:', error);
    }
  };

  const fetchProfile = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      
      // Récupérer le profil par slug
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .eq('public_profile', true)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Récupérer les annonces de l'utilisateur
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('is_published', true)
        .eq('is_draft', false)
        .eq('is_paused', false)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      // Récupérer les statistiques de clics pour les annonces de cet utilisateur
      const { data: clickStatsData, error: clickStatsError } = await supabase
        .from('click_stats')
        .select(`
          click_type,
          ads!inner(user_id)
        `)
        .eq('ads.user_id', profileData.id);

      if (clickStatsError) throw clickStatsError;

      // Calculer les statistiques par annonce
      const adsWithStats = adsData.map(ad => {
        const adViews = clickStatsData?.filter(stat => 
          stat.click_type === 'ad_view' && stat.ads?.user_id === profileData.id
        ).length || 0;
        
        const contactViews = clickStatsData?.filter(stat => 
          stat.click_type === 'contact_view' && stat.ads?.user_id === profileData.id
        ).length || 0;

        return {
          ...ad,
          ad_views: adViews,
          contact_views: contactViews
        } as UserAd;
      });

      setUserAds(adsWithStats);

      // Calculer les statistiques globales
      const totalViews = clickStatsData?.filter(stat => stat.click_type === 'ad_view').length || 0;
      const totalContacts = clickStatsData?.filter(stat => stat.click_type === 'contact_view').length || 0;
      const categories = [...new Set(adsData.map(ad => ad.category))];

      setStats({
        totalAds: adsData.length,
        totalViews,
        totalContacts,
        categories
      });

    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Profil non trouvé');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    const categories = {
      sejours: 'Séjours',
      vols: 'Vols',
      guides: 'Guides',
      chauffeurs: 'Chauffeurs',
      babysitting: 'Baby-sitting',
      hebergement: 'Hébergements'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      guides: '🕌',
      chauffeurs: '🚗',
      babysitting: '👶',
      sejours: '✈️',
      vols: '🛫',
      hebergement: '🏨'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const handleContactClick = () => {
    // Le tracking sera fait automatiquement quand l'utilisateur clique sur une annonce
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const getDisplayName = () => {
    if (!profile) return '';
    
    if (profile.is_professional && profile.company_name) {
      return profile.company_name;
    }
    
    if (profile.kuniya) {
      return profile.kuniya;
    }
    
    return profile.full_name || profile.first_name || 'Utilisateur';
  };

  const getProfileInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
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

  if (!profile) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
            <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <span className="text-lg font-semibold truncate ml-4">
                Profil de {getDisplayName()}
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                      <AvatarImage src={profile.profile_image} alt={getDisplayName()} />
                      <AvatarFallback className="text-2xl font-bold">
                        {getProfileInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                          {getDisplayName()}
                        </h1>
                        {profile.is_professional && (
                          <div className="flex items-center text-muted-foreground mb-2">
                            <Building className="w-4 h-4 mr-2" />
                            <span>Compte professionnel</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Contact Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={handleContactClick}>
                            Contacter
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Contacter {getDisplayName()}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {profile.email && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Mail className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.email}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(profile.email || '')}
                                >
                                  Copier
                                </Button>
                              </div>
                            )}

                            {profile.whatsapp && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.whatsapp_country}{profile.whatsapp}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(`${profile.whatsapp_country}${profile.whatsapp}` || '')}
                                >
                                  Copier
                                </Button>
                              </div>
                            )}

                            {profile.phone && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Phone className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.phone_country}{profile.phone}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(`${profile.phone_country}${profile.phone}` || '')}
                                >
                                  Copier
                                </Button>
                              </div>
                            )}

                            {profile.professional_phone && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Phone className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.professional_phone_country}{profile.professional_phone}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">Pro</Badge>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(`${profile.professional_phone_country}${profile.professional_phone}` || '')}
                                >
                                  Copier
                                </Button>
                              </div>
                            )}

                            {profile.facebook && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Facebook className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.facebook}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(`https://facebook.com/${profile.facebook}`, '_blank')}
                                >
                                  Voir
                                </Button>
                              </div>
                            )}

                            {profile.instagram && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Instagram className="w-5 h-5 text-muted-foreground" />
                                  <span>{profile.instagram}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(`https://instagram.com/${profile.instagram}`, '_blank')}
                                >
                                  Voir
                                </Button>
                              </div>
                            )}

                            {profile.website && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-muted-foreground" />
                                  <span className="truncate">{profile.website}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(profile.website?.startsWith('http') ? profile.website : `https://${profile.website}`, '_blank')}
                                >
                                  Visiter
                                </Button>
                              </div>
                            )}

                            {profile.company_address && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-5 h-5 text-muted-foreground" />
                                  <span className="text-sm">{profile.company_address}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(profile.company_address || '')}
                                >
                                  Copier
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-muted-foreground mb-4">{profile.bio}</p>
                    )}

                    {/* Specialties */}
                    {profile.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Languages */}
                    {profile.languages_spoken.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <Languages className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Langues parlées: {profile.languages_spoken.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Experience */}
                    {profile.experience_years && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {profile.experience_years} années d'expérience
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalAds}</div>
                  <p className="text-xs text-muted-foreground">Annonces actives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{profile.profile_views}</div>
                  <p className="text-xs text-muted-foreground">Vues du profil</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Vues d'annonces</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalContacts}</div>
                  <p className="text-xs text-muted-foreground">Contacts reçus</p>
                </CardContent>
              </Card>
            </div>

            {/* Services */}
            {stats.categories.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Services proposés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {stats.categories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        <span className="font-medium">{getCategoryName(category)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Ads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Annonces ({userAds.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userAds.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucune annonce active pour le moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userAds.map((ad) => (
                      <Card 
                        key={ad.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/ad/${ad.id}`)}
                      >
                        {ad.cover_image && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img 
                              src={ad.cover_image} 
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">
                              {getCategoryName(ad.category)}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Eye className="w-3 h-3 mr-1" />
                              {ad.ad_views}
                            </div>
                          </div>
                          <CardTitle className="text-lg leading-tight line-clamp-2">
                            {ad.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {ad.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-primary">
                              {ad.price}€
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {ad.contact_views} contacts
                            </div>
                          </div>

                          {ad.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {ad.location}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PublicProfile;