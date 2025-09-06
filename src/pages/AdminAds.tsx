import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Edit, Trash2, Shield, Calendar, MapPin, User, MousePointer, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/ui/UserMenu';

interface AdData {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location?: string;
  cover_image?: string;
  is_published: boolean;
  is_draft: boolean;
  is_paused: boolean;
  publish_end_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    full_name?: string;
    first_name?: string;
    email?: string;
    company_name?: string;
    is_professional?: boolean;
  };
  ad_views: number;
  contact_views: number;
}

const AdminAds = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalAds: 0,
    publishedAds: 0,
    draftAds: 0,
    pausedAds: 0,
    totalViews: 0,
    totalContacts: 0
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchAds();
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les annonces avec les profils utilisateurs
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select(`
          *,
          profiles!inner(
            full_name,
            first_name,
            email,
            company_name,
            is_professional
          )
        `)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      // Récupérer les statistiques de clics pour chaque annonce
      const { data: clickStatsData, error: clickStatsError } = await supabase
        .from('click_stats')
        .select('ad_id, click_type');

      if (clickStatsError) throw clickStatsError;

      // Calculer les statistiques par annonce
      const adsWithStats = adsData.map(ad => {
        const adViews = clickStatsData?.filter(stat => 
          stat.ad_id === ad.id && stat.click_type === 'ad_view'
        ).length || 0;
        
        const contactViews = clickStatsData?.filter(stat => 
          stat.ad_id === ad.id && stat.click_type === 'contact_view'
        ).length || 0;

        return {
          ...ad,
          user: ad.profiles,
          ad_views: adViews,
          contact_views: contactViews
        } as AdData;
      });

      // Calculer les statistiques globales
      const totalViews = clickStatsData?.filter(stat => stat.click_type === 'ad_view').length || 0;
      const totalContacts = clickStatsData?.filter(stat => stat.click_type === 'contact_view').length || 0;
      
      setStats({
        totalAds: adsWithStats.length,
        publishedAds: adsWithStats.filter(ad => ad.is_published && !ad.is_draft && !ad.is_paused).length,
        draftAds: adsWithStats.filter(ad => ad.is_draft).length,
        pausedAds: adsWithStats.filter(ad => ad.is_paused).length,
        totalViews,
        totalContacts
      });

      setAds(adsWithStats);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Annonce supprimée avec succès",
      });

      fetchAds();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (adId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_published: !currentStatus })
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Annonce ${!currentStatus ? 'publiée' : 'dépubliée'} avec succès`,
      });

      fetchAds();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'annonce",
        variant: "destructive",
      });
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

  const getStatusBadge = (ad: AdData) => {
    if (ad.is_draft) {
      return <Badge variant="secondary">Brouillon</Badge>;
    }
    if (ad.is_paused) {
      return <Badge variant="outline">En pause</Badge>;
    }
    if (ad.is_published) {
      return <Badge variant="default">Publiée</Badge>;
    }
    return <Badge variant="destructive">Non publiée</Badge>;
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && ad.is_published && !ad.is_draft && !ad.is_paused) ||
                         (statusFilter === 'draft' && ad.is_draft) ||
                         (statusFilter === 'paused' && ad.is_paused) ||
                         (statusFilter === 'unpublished' && !ad.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour admin
              </Button>
              <span className="text-2xl font-normal text-foreground tracking-tight">
                Gestion des annonces
              </span>
              <Badge variant="outline" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Administration
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des annonces</h1>
            <p className="text-muted-foreground mt-2">Gérez toutes les annonces publiées sur la plateforme</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Annonces</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Publiées</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draftAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En pause</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pausedAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vues</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Rechercher par titre, auteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="sejours">Séjours</SelectItem>
                      <SelectItem value="vols">Vols</SelectItem>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="chauffeurs">Chauffeurs</SelectItem>
                      <SelectItem value="babysitting">Baby-sitting</SelectItem>
                      <SelectItem value="hebergement">Hébergements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="published">Publiées</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                      <SelectItem value="paused">En pause</SelectItem>
                      <SelectItem value="unpublished">Non publiées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des annonces</CardTitle>
              <CardDescription>
                {filteredAds.length} annonce(s) trouvée(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Annonce</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Statistiques</TableHead>
                      <TableHead>Créée le</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAds.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{ad.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{ad.description}</div>
                            {ad.location && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {ad.location}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {ad.user?.full_name || ad.user?.first_name || 'Sans nom'}
                            </div>
                            <div className="text-sm text-muted-foreground">{ad.user?.email}</div>
                            {ad.user?.is_professional && ad.user?.company_name && (
                              <div className="text-xs text-blue-600">{ad.user.company_name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryName(ad.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ad.price}€</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(ad)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-xs flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {ad.ad_views} vues
                            </div>
                            <div className="text-xs flex items-center text-green-600">
                              <MousePointer className="w-3 h-3 mr-1" />
                              {ad.contact_views} contacts
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/ad/${ad.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublish(ad.id, ad.is_published)}
                            >
                              {ad.is_published ? 'Dépublier' : 'Publier'}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'annonce</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteAd(ad.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAds;