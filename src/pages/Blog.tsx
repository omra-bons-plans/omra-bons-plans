import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Eye, Calendar, Tag, Video, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import VendorAssociationForm from '@/components/ui/VendorAssociationForm';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  video_url?: string;
  category: 'general' | 'restaurants' | 'associations' | 'vendeurs';
  location_address?: string;
  location_city?: string;
  tags: string[];
  views_count: number;
  created_at: string;
  published_at?: string;
  author?: {
    full_name?: string;
    first_name?: string;
  };
}

const Blog = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');

  console.log('📖 Blog component loaded, category:', category, 'selectedCategory:', selectedCategory);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('📖 Fetching posts for category:', selectedCategory);
      
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          excerpt,
          cover_image,
          images,
          video_url,
          category,
          location_address,
          location_city,
          location_latitude,
          location_longitude,
          tags,
          views_count,
          created_at,
          updated_at,
          published_at,
          author_id
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      console.log('📖 Query built, selectedCategory:', selectedCategory);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
        console.log('📖 Added category filter:', selectedCategory);
      }

      console.log('📖 Executing query...');
      const { data, error } = await query;

      console.log('📖 Query result - data:', data, 'error:', error);

      if (error) throw error;

      const postsWithAuthors = data.map(post => ({
        ...post,
        author: { full_name: 'Auteur', first_name: 'Auteur' },
        tags: post.tags || []
      })) as BlogPost[];

      setPosts(postsWithAuthors);
      console.log('📖 Posts loaded:', postsWithAuthors.length, 'posts', postsWithAuthors);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      toast.error('Erreur lors du chargement des articles');
      setPosts([]); // S'assurer que posts est un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post: BlogPost) => {
    // Incrémenter le compteur de vues
    try {
      await supabase
        .from('blog_posts')
        .update({ views_count: post.views_count + 1 })
        .eq('id', post.id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des vues:', error);
    }

    navigate(`/blog/${post.category}/${post.id}`);
  };

  const getCategoryName = (cat: string) => {
    const categories = {
      general: 'Blog général',
      restaurants: 'Restaurants',
      associations: 'Associations',
      vendeurs: 'Vendeurs',
      all: 'Toutes les sections'
    };
    return categories[cat as keyof typeof categories] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      restaurants: 'bg-green-100 text-green-800',
      associations: 'bg-purple-100 text-purple-800',
      vendeurs: 'bg-orange-100 text-orange-800'
    };
    return colors[cat as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
                         post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    console.log('🔍 Filtering post:', post.title, 'matches search:', matchesSearch, 'searchTerm:', searchTerm);
    return matchesSearch;
  });

  console.log('📖 Blog render - posts:', posts.length, 'filteredPosts:', filteredPosts.length, 'loading:', loading);

  const categories = [
    { value: 'all', label: 'Toutes les sections', count: posts.length },
    { value: 'general', label: 'Blog général', count: posts.filter(p => p.category === 'general').length },
    { value: 'restaurants', label: 'Restaurants', count: posts.filter(p => p.category === 'restaurants').length },
    { value: 'associations', label: 'Associations', count: posts.filter(p => p.category === 'associations').length },
    { value: 'vendeurs', label: 'Vendeurs', count: posts.filter(p => p.category === 'vendeurs').length }
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <span className="text-xl font-semibold">
                {getCategoryName(selectedCategory)}
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          {/* Page Title and Description */}
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              {getCategoryName(selectedCategory)}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {selectedCategory === 'general' && "Découvrez nos articles sur l'Omra, le Hajj, et la vie spirituelle"}
              {selectedCategory === 'restaurants' && "Les meilleurs restaurants halal pour votre séjour"}
              {selectedCategory === 'associations' && "Découvrez les associations qui œuvrent pour la communauté"}
              {selectedCategory === 'vendeurs' && "Trouvez les meilleurs commerçants pour vos besoins"}
              {selectedCategory === 'all' && "Découvrez tous nos articles et guides"}
            </p>
          </div>

          {/* Category Tabs - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="flex items-center justify-between sm:justify-center text-sm w-full lg:w-auto h-12"
                >
                  <span className="truncate">{cat.label}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            <Input
              placeholder="Rechercher dans les articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12"
            />
          </div>

          {/* Contact Form for Vendors and Associations */}
          {(selectedCategory === 'vendeurs' || selectedCategory === 'associations') ? (
            <VendorAssociationForm 
              type={selectedCategory === 'vendeurs' ? 'vendeur' : 'association'} 
            />
          ) : (
            <>
              {/* Posts Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Aucun article trouvé
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Aucun article publié pour le moment'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Debug: posts={posts.length}, filteredPosts={filteredPosts.length}, loading={loading ? 'true' : 'false'}
                  </p>
                </div>
              ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-card border rounded-2xl overflow-hidden"
                  onClick={() => handlePostClick(post)}
                >
                  {post.cover_image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <Badge className={`${getCategoryColor(post.category)} text-xs px-3 py-1 rounded-full w-fit`}>
                        {getCategoryName(post.category)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views_count}
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl leading-tight line-clamp-2 font-semibold">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate font-medium">{post.author?.full_name || post.author?.first_name || 'Anonyme'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {post.location_city && (
                      <div className="flex items-center text-xs text-muted-foreground mt-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{post.location_city}</span>
                      </div>
                    )}

                    {post.video_url && (
                      <div className="flex items-center text-xs text-blue-600 mt-3">
                        <Video className="w-4 h-4 mr-2 flex-shrink-0" />
                        Contient une vidéo
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-3 py-1 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-3 py-1 rounded-full">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Blog;