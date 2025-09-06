import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, Edit, Trash2, Shield, Calendar, MapPin, User, Video, Image } from 'lucide-react';
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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  images: string[];
  video_url?: string;
  category: 'general' | 'restaurants' | 'associations' | 'vendeurs';
  author_id: string;
  is_published: boolean;
  location_address?: string;
  location_latitude?: number;
  location_longitude?: number;
  location_city?: string;
  tags: string[];
  views_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author?: {
    full_name?: string;
    first_name?: string;
    email?: string;
  };
}

const AdminBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    general: 0,
    restaurants: 0,
    associations: 0,
    vendeurs: 0
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin, adminLoading, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les articles avec les profils auteurs
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!inner(
            full_name,
            first_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const postsWithAuthors = postsData.map(post => ({
        ...post,
        author: post.profiles
      })) as BlogPost[];

      // Calculer les statistiques
      const totalViews = postsWithAuthors.reduce((sum, post) => sum + post.views_count, 0);
      
      setStats({
        totalPosts: postsWithAuthors.length,
        publishedPosts: postsWithAuthors.filter(post => post.is_published).length,
        draftPosts: postsWithAuthors.filter(post => !post.is_published).length,
        totalViews,
        general: postsWithAuthors.filter(post => post.category === 'general').length,
        restaurants: postsWithAuthors.filter(post => post.category === 'restaurants').length,
        associations: postsWithAuthors.filter(post => post.category === 'associations').length,
        vendeurs: postsWithAuthors.filter(post => post.category === 'vendeurs').length
      });

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });

      fetchPosts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Article ${!currentStatus ? 'publié' : 'dépublié'} avec succès`,
      });

      fetchPosts();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'article",
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (category: string) => {
    const categories = {
      general: 'Blog général',
      restaurants: 'Restaurants',
      associations: 'Associations',
      vendeurs: 'Vendeurs'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      restaurants: 'bg-green-100 text-green-800',
      associations: 'bg-purple-100 text-purple-800',
      vendeurs: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author?.first_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.is_published) ||
                         (statusFilter === 'draft' && !post.is_published);

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
                Gestion du blog
              </span>
              <Badge variant="outline" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Administration
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/blog/new')}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
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
            <h1 className="text-3xl font-bold text-foreground">Gestion du blog</h1>
            <p className="text-muted-foreground mt-2">Gérez tous les articles de blog des 4 sections</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedPosts} publiés, {stats.draftPosts} brouillons
                </p>
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
                <CardTitle className="text-sm font-medium">Par Catégorie</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div>Général: {stats.general}</div>
                  <div>Restaurants: {stats.restaurants}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Associations & Vendeurs</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div>Associations: {stats.associations}</div>
                  <div>Vendeurs: {stats.vendeurs}</div>
                </div>
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
                    placeholder="Rechercher par titre, contenu, auteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sections</SelectItem>
                      <SelectItem value="general">Blog général</SelectItem>
                      <SelectItem value="restaurants">Restaurants</SelectItem>
                      <SelectItem value="associations">Associations</SelectItem>
                      <SelectItem value="vendeurs">Vendeurs</SelectItem>
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
                      <SelectItem value="published">Publiés</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des articles</CardTitle>
              <CardDescription>
                {filteredPosts.length} article(s) trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Médias</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Vues</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{post.title}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {post.excerpt || post.content.substring(0, 100)}...
                            </div>
                            {post.location_address && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {post.location_city || post.location_address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {post.author?.full_name || post.author?.first_name || 'Sans nom'}
                            </div>
                            <div className="text-sm text-muted-foreground">{post.author?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryName(post.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {post.cover_image && (
                              <div className="w-8 h-8 rounded overflow-hidden">
                                <img 
                                  src={post.cover_image} 
                                  alt="Cover" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {post.images.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Image className="w-3 h-3 mr-1" />
                                {post.images.length}
                              </Badge>
                            )}
                            {post.video_url && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Vidéo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.is_published ? "default" : "secondary"}>
                            {post.is_published ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{post.views_count}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/${post.category}/${post.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublish(post.id, post.is_published)}
                            >
                              {post.is_published ? 'Dépublier' : 'Publier'}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id)}
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

export default AdminBlog;