import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Mail, Phone, Building, Calendar, Eye, Trash2, Shield, MousePointer, Activity } from 'lucide-react';
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

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  phone: string;
  whatsapp: string;
  company_name: string;
  is_professional: boolean;
  created_at: string;
  role: 'admin' | 'user';
  ads_count: number;
  ad_views: number;
  contact_views: number;
  slug?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [clickStats, setClickStats] = useState({
    totalAdViews: 0,
    totalContactViews: 0,
    totalClicks: 0
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les profils avec les rôles et le nombre d'annonces
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          first_name,
          phone,
          whatsapp,
          company_name,
          is_professional,
          created_at,
          slug
        `);

      if (profilesError) throw profilesError;

      // Récupérer les rôles pour chaque utilisateur
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Récupérer le nombre d'annonces pour chaque utilisateur
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('user_id');

      if (adsError) throw adsError;

      // Récupérer les statistiques de clics pour chaque utilisateur
      const { data: clickStatsData, error: clickStatsError } = await supabase
        .from('click_stats')
        .select(`
          click_type,
          ads!inner(user_id)
        `);

      if (clickStatsError) throw clickStatsError;

      // Calculer les statistiques globales
      const totalAdViews = clickStatsData?.filter(stat => stat.click_type === 'ad_view').length || 0;
      const totalContactViews = clickStatsData?.filter(stat => stat.click_type === 'contact_view').length || 0;
      setClickStats({
        totalAdViews,
        totalContactViews,
        totalClicks: totalAdViews + totalContactViews
      });

      // Combiner les données
      const usersWithRoles = profilesData.map(profile => {
        const userRole = rolesData.find(role => role.user_id === profile.id);
        const userAdsCount = adsData.filter(ad => ad.user_id === profile.id).length;
        
        // Calculer les statistiques pour cet utilisateur
        const userAdViews = clickStatsData?.filter(stat => 
          stat.click_type === 'ad_view' && stat.ads?.user_id === profile.id
        ).length || 0;
        
        const userContactViews = clickStatsData?.filter(stat => 
          stat.click_type === 'contact_view' && stat.ads?.user_id === profile.id
        ).length || 0;
        
        return {
          ...profile,
          role: userRole?.role || 'user',
          ads_count: userAdsCount,
          ad_views: userAdViews,
          contact_views: userContactViews
        } as UserProfile;
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // Supprimer le rôle existant
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Ajouter le nouveau rôle
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Rôle mis à jour vers ${newRole}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Supprimer d'abord les annonces de l'utilisateur
      await supabase
        .from('ads')
        .delete()
        .eq('user_id', userId);

      // Supprimer le profil
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesAccountType = accountTypeFilter === 'all' || 
                              (accountTypeFilter === 'professional' && user.is_professional) ||
                              (accountTypeFilter === 'individual' && !user.is_professional);

    return matchesSearch && matchesRole && matchesAccountType;
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

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const professionalUsers = users.filter(u => u.is_professional).length;
  const totalAds = users.reduce((sum, user) => sum + user.ads_count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-normal text-foreground tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                OmraBonsPlans.fr
              </span>
              <Badge variant="outline" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Administration
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/ads')}
                className="text-sm"
              >
                Gérer les annonces
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/blog')}
                className="text-sm"
              >
                Gérer le blog
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des comptes clients</h1>
            <p className="text-muted-foreground mt-2">Gérez les utilisateurs, leurs rôles et leurs annonces</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comptes Pro</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{professionalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Annonces</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAds}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vues Annonces</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clickStats.totalAdViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clics Contact</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clickStats.totalContactViews}</div>
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
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="user">Utilisateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les comptes</SelectItem>
                      <SelectItem value="professional">Professionnels</SelectItem>
                      <SelectItem value="individual">Particuliers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Annonces</TableHead>
                      <TableHead>Statistiques</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name || user.first_name || 'Sans nom'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.company_name && (
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                {user.company_name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.phone && (
                              <div className="text-sm flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                            {user.whatsapp && (
                              <div className="text-sm text-green-600">
                                WhatsApp: {user.whatsapp}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_professional ? "default" : "secondary"}>
                            {user.is_professional ? "Professionnel" : "Particulier"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                            disabled={false} // Tous les admins peuvent changer les rôles
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.ads_count} annonce{user.ads_count > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-xs flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {user.ad_views} vues
                            </div>
                            <div className="text-xs flex items-center text-green-600">
                              <MousePointer className="w-3 h-3 mr-1" />
                              {user.contact_views} contacts
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/profile/${user.slug || user.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.id !== user?.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également toutes ses annonces.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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

export default Admin;