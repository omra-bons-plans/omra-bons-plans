import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Tag from 'lucide-react/dist/esm/icons/tag';
import Video from 'lucide-react/dist/esm/icons/video';
import User from 'lucide-react/dist/esm/icons/user';
import Menu from 'lucide-react/dist/esm/icons/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import VendorAssociationForm from '@/components/ui/VendorAssociationForm';
import { SEOHead, seoConfig } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { getImageUrl } from '@/utils/imageUtils';
import UniversalImage from '@/components/ui/UniversalImage';
import { InternalLinks } from '@/components/SEO/InternalLinks';

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
  slug: string;
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
  // Initialiser directement avec la catégorie de l'URL
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return category || 'all';
  });

  console.log('📖 Blog component loaded, category:', category, 'selectedCategory:', selectedCategory);

  // Mettre à jour selectedCategory quand la catégorie URL change
  useEffect(() => {
    const newCategory = category || 'all';
    console.log('📖 URL category changed to:', newCategory, 'current selectedCategory:', selectedCategory);
    setSelectedCategory(newCategory);
  }, [category]); // Enlever selectedCategory des dépendances pour éviter les boucles

  useEffect(() => {
    fetchPosts();
  }, []); // Charger les posts une seule fois

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('📖 Fetching all posts for counters');
      
      // Toujours récupérer TOUS les articles publiés pour calculer les compteurs correctement
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
          author_id,
          slug
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false });

      console.log('📖 Executing query for all posts...');
      const { data, error } = await query;

      console.log('📖 Query result - data:', data, 'error:', error);

      if (error) throw error;

      const postsWithAuthors = data.map(post => ({
        ...post,
        author: { full_name: 'Auteur', first_name: 'Auteur' },
        tags: post.tags || []
      })) as BlogPost[];

      setPosts(postsWithAuthors);
      console.log('📖 All posts loaded:', postsWithAuthors.length, 'posts', postsWithAuthors);
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

    navigate(`/blog/${post.category}/${post.slug}`);
  };

  const getCategoryName = (cat: string) => {
    const categories = {
      general: 'Blog Omra Hajj Conseils Spiritualité',
      restaurants: 'Restaurants Halal Mecca Medina Guide',
      associations: 'Associations Musulmanes Omra Hajj Communauté',
      vendeurs: 'Vendeurs Omra Hajj Produits Services',
      all: 'Toutes Sections Blog Omra Hajj'
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
    try {
      // Filtrer par catégorie
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      // Filtrer par recherche avec des vérifications sécurisées
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
                           (post.title && post.title.toLowerCase().includes(searchLower)) ||
                           (post.content && post.content.toLowerCase().includes(searchLower)) ||
                           (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
                           (post.tags && Array.isArray(post.tags) && post.tags.some(tag => 
                             tag && typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
                           ));
      
      console.log('🔍 Filtering post:', post.title, 'category match:', matchesCategory, 'search match:', matchesSearch);
      return matchesCategory && matchesSearch;
    } catch (error) {
      console.error('Erreur lors du filtrage du post:', post, error);
      return false;
    }
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
      <SEOHead
        title={
          category === 'general' ? 'Blog Omra & Hajj 2026 | Guides et Conseils Pèlerinage'
          : category ? `Blog ${getCategoryName(category)} - Omra Bons Plans`
          : 'Blog Omra & Hajj 2026 | Guides, Conseils et Actualités Pèlerinage'
        }
        description={
          category === 'general'
            ? "Guides complets Omra & Hajj 2026 : rites, préparation, visa, bagages, prix, agences. Conseils d'experts pour réussir votre pèlerinage en Arabie Saoudite."
            : category
            ? `Articles ${getCategoryName(category).toLowerCase()} pour votre pèlerinage.`
            : "Guides complets Omra & Hajj 2026 : rites, préparation, visa, bagages, prix, agences. Conseils d'experts pour réussir votre pèlerinage en Arabie Saoudite."
        }
        keywords="blog omra, guides hajj, préparation pèlerinage, rites omra, visa omra, prix omra 2026"
        canonical={`https://omrabonsplans.fr/blog${category ? `/${category}` : ''}`}
        noindex={['restaurants', 'vendeurs', 'associations'].includes(category || '')}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog Omra & Hajj - Omra Bons Plans",
          "url": `https://omrabonsplans.fr/blog${category ? `/${category}` : ''}`,
          "description": "Guides et conseils pour le pèlerinage Omra et Hajj",
          "publisher": {
            "@type": "Organization",
            "name": "Omra Bons Plans",
            "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp"
          }
        }}
      />
      <SEOBreadcrumb className="container mx-auto px-6 pt-4" />
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
              <span className="text-xl font-semibold">
                {getCategoryName(selectedCategory)}
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8">
          {/* Page Title and Description - Compact on mobile */}
          <div className="text-center mb-4 sm:mb-8 px-2">
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-4">
              {selectedCategory === 'all' ? "Blog Omra & Hajj : Guides et Conseils 2026-2027" : `Blog ${getCategoryName(selectedCategory)}`}
            </h1>
            <h2 className="text-base sm:text-xl text-muted-foreground mb-2 font-semibold">
              {selectedCategory === 'general' && "Guides complets et conseils pratiques pour réussir votre Omra et Hajj 2026-2027"}
              {selectedCategory === 'restaurants' && "Sélection des meilleurs restaurants halal certifiés à La Mecque et Médine"}
              {selectedCategory === 'associations' && "Associations musulmanes et organisations caritatives œuvrant pour la communauté"}
              {selectedCategory === 'vendeurs' && "Annuaire des commerçants et artisans de confiance pour vos besoins"}
              {selectedCategory === 'all' && "Tous nos articles, guides et ressources pour organiser votre pèlerinage Omra et Hajj"}
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto hidden sm:block">
              {selectedCategory === 'general' && "Découvrez nos articles sur l'Omra, le Hajj, et la vie spirituelle"}
              {selectedCategory === 'restaurants' && "Les meilleurs restaurants halal pour votre séjour"}
              {selectedCategory === 'associations' && "Découvrez les associations qui œuvrent pour la communauté"}
              {selectedCategory === 'vendeurs' && "Trouvez les meilleurs commerçants pour vos besoins"}
              {selectedCategory === 'all' && "Découvrez tous nos articles et guides"}
            </p>
          </div>

          {/* Category Selection - Hamburger on mobile, tabs on desktop */}
          <div className="mb-4 sm:mb-8">
            {/* Mobile hamburger menu */}
            <div className="sm:hidden px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    <span className="flex items-center">
                      <Menu className="h-4 w-4 mr-2" />
                      {getCategoryName(selectedCategory)}
                    </span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {categories.find(cat => cat.value === selectedCategory)?.count || 0}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 Navigating to category:', cat.value);
                        try {
                          if (cat.value === 'all') {
                            navigate('/blog', { replace: true });
                          } else {
                            navigate(`/blog/${cat.value}`, { replace: true });
                          }
                        } catch (error) {
                          console.error('❌ Navigation error:', error);
                        }
                      }}
                      className={selectedCategory === cat.value ? "bg-muted" : ""}
                    >
                      <span className="flex-1">{cat.label}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {cat.count}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/guide-hajj-4-ecoles');
                    }}
                    className="border-t mt-1 pt-1 text-primary font-medium"
                  >
                    <span className="flex-1">🎁 Guide Hajj 4 Écoles</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="hidden sm:grid sm:grid-cols-2 lg:flex lg:justify-center lg:gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('🎯 Desktop navigation to category:', cat.value);
                    try {
                      if (cat.value === 'all') {
                        navigate('/blog', { replace: true });
                      } else {
                        navigate(`/blog/${cat.value}`, { replace: true });
                      }
                    } catch (error) {
                      console.error('❌ Desktop navigation error:', error);
                    }
                  }}
                  className="flex items-center justify-center text-sm h-12 w-full lg:w-auto"
                >
                  <span className="truncate">{cat.label}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => navigate('/guide-hajj-4-ecoles')}
                className="flex items-center justify-center text-sm h-12 w-full lg:w-auto border-primary/50 text-primary hover:bg-primary/10"
              >
                <span className="truncate">🎁 Guide Hajj 4 Écoles</span>
              </Button>
            </div>
          </div>

          {/* Search - Compact on mobile */}
          <div className="max-w-md mx-auto mb-4 sm:mb-8 px-2 sm:px-0">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 sm:h-12 text-sm sm:text-base"
            />
          </div>

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
            <>
              {/* Mobile List View */}
              <div className="sm:hidden space-y-4 px-2">
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors p-2 rounded-lg"
                    onClick={() => handlePostClick(post)}
                  >
                    {/* Image à gauche - carrée */}
                    {post.cover_image && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <UniversalImage 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    {/* Contenu à droite */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Catégorie */}
                        <Badge variant="secondary" className="text-xs mb-1.5 bg-blue-100 text-blue-700">
                          {getCategoryName(post.category).split(' ')[0]}
                        </Badge>
                        
                        {/* Titre */}
                        <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-3">
                          {post.title}
                        </h3>
                      </div>
                      
                      {/* Auteur */}
                      <p className="text-xs text-muted-foreground mt-1">
                        {post.author?.full_name || post.author?.first_name || 'Omra Bons Plans'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Grid View */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow bg-card border rounded-2xl overflow-hidden"
                    onClick={() => handlePostClick(post)}
                  >
                    {post.cover_image && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <UniversalImage 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-3 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(post.category)} text-xs px-3 py-1 rounded-full w-fit`}>
                          {getCategoryName(post.category)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views_count}
                        </div>
                      </div>
                      <CardTitle className="text-xl leading-tight line-clamp-2 font-semibold">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-6">
                      <div className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        <MarkdownRenderer 
                          content={(post.excerpt || post.content.substring(0, 150)) + (post.excerpt && post.excerpt.length <= 150 ? '' : '...')}
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
            </>
          )}

          {/* Contact Form for Vendors and Associations - Displayed at bottom */}
          {(selectedCategory === 'vendeurs' || selectedCategory === 'associations') && (
            <div className="mt-12 max-w-2xl mx-auto">
              <VendorAssociationForm 
                type={selectedCategory === 'vendeurs' ? 'vendeur' : 'association'} 
              />
            </div>
          )}
          
          {/* Liens internes SEO */}
          <InternalLinks currentPage="/blog" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Blog;