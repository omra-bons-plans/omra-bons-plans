import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Eye, Calendar, Tag, Video, User, Share2, Phone, Instagram, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageGalleryDisplay } from '@/components/ui/ImageGalleryDisplay';
import { ContactModal } from '@/components/ui/ContactModal';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { getImageUrl } from '@/utils/imageUtils';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  images?: string[];
  video_url?: string;
  category: 'general' | 'restaurants' | 'associations' | 'vendeurs';
  location_address?: string;
  location_city?: string;
  location_latitude?: number;
  location_longitude?: number;
  contact_phone?: string;
  contact_instagram?: string;
  tags: string[];
  views_count: number;
  created_at: string;
  published_at?: string;
  slug: string;
  author?: {
    full_name?: string;
    first_name?: string;
    email?: string;
  };
}

const BlogPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      
      // Récupérer l'article par slug
      const { data: postData, error: postError } = await supabase
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
          contact_phone,
          contact_instagram,
          tags,
          views_count,
          created_at,
          updated_at,
          published_at,
          author_id,
          slug
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (postError) throw postError;
      
      if (!postData) {
        toast.error('Article non trouvé');
        navigate('/blog');
        return;
      }

      const postWithAuthor = {
        ...postData,
        author: { full_name: 'Auteur', first_name: 'Auteur' }
      } as BlogPost;

      setPost(postWithAuthor);

      // Incrémenter le compteur de vues
      await supabase
        .from('blog_posts')
        .update({ views_count: postWithAuthor.views_count + 1 })
        .eq('id', postWithAuthor.id);

      // Récupérer les articles similaires
      const { data: relatedData, error: relatedError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          excerpt,
          cover_image,
          category,
          location_city,
          tags,
          published_at,
          created_at,
          views_count,
          author_id,
          slug
        `)
        .eq('is_published', true)
        .eq('category', postWithAuthor.category)
        .neq('id', postWithAuthor.id)
        .order('published_at', { ascending: false })
        .limit(3);

      if (!relatedError && relatedData) {
        const relatedWithAuthors = relatedData.map(related => ({
          ...related,
          author: { full_name: 'Auteur', first_name: 'Auteur' }
        })) as BlogPost[];
        setRelatedPosts(relatedWithAuthors);
      }

    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      toast.error('Article non trouvé');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (cat: string) => {
    const categories = {
      general: 'Blog général',
      restaurants: 'Restaurants',
      associations: 'Associations',
      vendeurs: 'Vendeurs'
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

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || post?.content.substring(0, 200),
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papier');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  const openMap = () => {
    if (post?.location_latitude && post?.location_longitude) {
      const mapUrl = `https://www.google.com/maps?q=${post.location_latitude},${post.location_longitude}`;
      window.open(mapUrl, '_blank');
    } else if (post?.location_address) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location_address)}`;
      window.open(mapUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!post) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Article non trouvé</h2>
            <Button onClick={() => navigate('/blog')}>Retour au blog</Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <DynamicSEO
        title={`${post.title} | Blog Omra Hajj - Omra Bons Plans`}
        description={post.excerpt || post.content.substring(0, 160)}
        keywords={post.tags}
        type="article"
        image={post.cover_image || undefined}
        path={`/blog/${category}/${slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || post.content.substring(0, 160),
          "image": post.cover_image,
          "datePublished": post.published_at || post.created_at,
          "author": {
            "@type": "Person",
            "name": post.author?.full_name || post.author?.first_name || 'Omra Bons Plans'
          }
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => {
                  // Check if we came from admin (state first, then referrer as fallback)
                  const fromAdmin = (location.state as any)?.fromAdmin || document.referrer.includes('/admin/blog');
                  if (fromAdmin) {
                    navigate('/admin/blog');
                  } else {
                    navigate(`/blog/${category}`);
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                variant="ghost"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button 
              onClick={() => navigate('/blog')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Blog
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/blog/${post.category}`)}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {getCategoryName(post.category)}
            </button>
            <span>/</span>
            <span className="text-foreground truncate">{post.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryName(post.category)}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-4 h-4 mr-1" />
                {post.views_count} vues
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author?.full_name || post.author?.first_name || 'Anonyme'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {post.location_city && (
                <button 
                  onClick={openMap}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  {post.location_city}
                </button>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Images Gallery */}
          {(post.cover_image || (post.images && post.images.length > 0)) && (
            <div className="mb-8 max-w-4xl">
              <ImageGalleryDisplay
                images={post.images || []}
                coverImage={post.cover_image}
                title={`Images - ${post.title}`}
                bucketName="blog-images"
              />
            </div>
          )}

          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 max-w-4xl">

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <MarkdownRenderer 
                content={post.content} 
                className="whitespace-pre-wrap leading-relaxed" 
              />
            </div>

            {/* Video */}
            {post.video_url && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Vidéo associée
                </h3>
                <VideoPlayer 
                  videoUrl={post.video_url} 
                  title={post.title}
                  className="w-full max-w-2xl"
                />
              </div>
            )}

            {/* Location Map */}
            {(post.location_address || (post.location_latitude && post.location_longitude)) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {post.location_address && (
                      <p className="text-sm">{post.location_address}</p>
                    )}
                    <Button
                      variant="outline"
                      onClick={openMap}
                      className="w-full"
                    >
                      Voir sur la carte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info - for vendeurs only */}
            {post.category === 'vendeurs' && (post.contact_phone || post.contact_instagram) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contacter le vendeur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactModal
                    contactInfo={{
                      phone: post.contact_phone || undefined,
                    }}
                    showOptions={{
                      show_email: false,
                      show_phone: !!post.contact_phone,
                      show_whatsapp: false,
                      show_professional_phone: false,
                    }}
                    ownerName="le vendeur"
                    isAuthenticated={!!user}
                    adId={post.id}
                  />
                  {post.contact_instagram && user && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        onClick={() => window.open(post.contact_instagram, '_blank')}
                        className="w-full justify-start"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Suivre sur Instagram
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Articles similaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card 
                      key={relatedPost.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/blog/${relatedPost.category}/${relatedPost.slug}`)}
                    >
                       {relatedPost.cover_image && (
                         <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                           <img 
                             src={getImageUrl(relatedPost.cover_image, undefined, 'blog-images')} 
                             alt={relatedPost.title}
                             className="w-full h-full object-cover"
                           />
                         </div>
                       )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base leading-tight line-clamp-2">
                          {relatedPost.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {relatedPost.excerpt || 'Cliquez pour lire l\'article...'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {relatedPost.views_count}
                          </div>
                          {relatedPost.location_city && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {relatedPost.location_city}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Community Link */}
            <Card className="mt-12 border-green-200 bg-green-50/50">
              <CardContent className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2 text-green-800">Rejoignez notre communauté</h3>
                <p className="text-green-700 mb-4">
                  Échangez avec d'autres membres, partagez vos expériences et restez informé des dernières actualités !
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://chat.whatsapp.com/YOUR_WHATSAPP_LINK', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Rejoindre WhatsApp
                </Button>
              </CardContent>
            </Card>
            </div>

            {/* Table of Contents - Desktop only */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <TableOfContents content={post.content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default BlogPost;