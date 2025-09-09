import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Eye, Calendar, Tag, Video, User, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { TableOfContents } from '@/components/ui/TableOfContents';

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
  location_latitude?: number;
  location_longitude?: number;
  tags: string[];
  views_count: number;
  created_at: string;
  published_at?: string;
  author?: {
    full_name?: string;
    first_name?: string;
    email?: string;
  };
}

const BlogPost = () => {
  const navigate = useNavigate();
  const { category, id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Récupérer l'article
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
          tags,
          views_count,
          created_at,
          updated_at,
          published_at,
          author_id
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (postError) throw postError;

      const postWithAuthor = {
        ...postData,
        author: { full_name: 'Auteur', first_name: 'Auteur' }
      } as BlogPost;

      setPost(postWithAuthor);

      // Incrémenter le compteur de vues
      await supabase
        .from('blog_posts')
        .update({ views_count: postWithAuthor.views_count + 1 })
        .eq('id', id);

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
          author_id
        `)
        .eq('is_published', true)
        .eq('category', postWithAuthor.category)
        .neq('id', id)
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/blog/${category}`)}
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

          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 max-w-4xl">
            {/* Article Header */}
            <div className="mb-8">
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

            {/* Cover Image */}
            {post.cover_image && (
              <div className="mb-8">
                <img 
                  src={post.cover_image} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="whitespace-pre-wrap leading-relaxed" id="article-content">
                {post.content.split('\n').map((line, index) => {
                  const trimmed = line.trim();
                  
                  // Check for markdown-style headings
                  const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
                  if (headingMatch) {
                    const level = headingMatch[1].length;
                    const text = headingMatch[2];
                    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                    return (
                      <HeadingTag 
                        key={index} 
                        id={`heading-${index}`}
                        className={`scroll-mt-24 ${level === 2 ? 'text-2xl font-bold mt-8 mb-4' : level === 3 ? 'text-xl font-semibold mt-6 mb-3' : 'text-lg font-medium mt-4 mb-2'}`}
                      >
                        {text}
                      </HeadingTag>
                    );
                  }
                  
                  // Check for potential headings (standalone lines that look like titles)
                  else if (
                    trimmed.length > 10 && 
                    trimmed.length < 100 && 
                    trimmed.match(/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ][a-zA-ZÀ-ÿ\s:'()0-9-]+$/) &&
                    !trimmed.includes('.') &&
                    !trimmed.includes(',') &&
                    index > 0 && 
                    post.content.split('\n')[index - 1]?.trim() === ''
                  ) {
                    return (
                      <h2 
                        key={index} 
                        id={`heading-${index}`}
                        className="text-xl font-semibold mt-6 mb-3 scroll-mt-24"
                      >
                        {trimmed}
                      </h2>
                    );
                  }
                  
                  // Regular content
                  return <div key={index}>{line}</div>;
                })}
              </div>
            </div>

            {/* Video */}
            {post.video_url && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Vidéo associée
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <a 
                    href={post.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Voir la vidéo →
                  </a>
                </div>
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

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Articles similaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card 
                      key={relatedPost.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/blog/${relatedPost.category}/${relatedPost.id}`)}
                    >
                      {relatedPost.cover_image && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img 
                            src={relatedPost.cover_image} 
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
            </div>

            {/* Table of Contents - Desktop only */}
            <div className="hidden xl:block w-64 flex-shrink-0">
              <TableOfContents content={post.content} />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default BlogPost;