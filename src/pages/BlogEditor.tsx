import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, MapPin, Image, Video, Tag, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/ui/UserMenu';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { SEOAnalyzer } from '@/components/ui/SEOAnalyzer';
import CountrySelect from '@/components/ui/CountrySelect';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BlogPostFormData {
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  images: string[];
  video_url: string;
  category: 'general' | 'restaurants' | 'associations' | 'vendeurs';
  is_published: boolean;
  scheduled_publish_at: Date | null;
  location_address: string;
  location_city: string;
  tags: string[];
  contact_phone: string;
  contact_phone_country: string;
  contact_instagram: string;
}

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    images: [],
    video_url: '',
    category: 'general',
    is_published: false,
    scheduled_publish_at: null,
    location_address: '',
    location_city: '',
    tags: [],
    contact_phone: '',
    contact_phone_country: '+33',
    contact_instagram: ''
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (isAdmin && isEditMode) {
      fetchPost();
    }
  }, [isAdmin, adminLoading, navigate, id]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        cover_image: data.cover_image || '',
        images: data.images || [],
        video_url: data.video_url || '',
        category: (data.category as 'general' | 'restaurants' | 'associations' | 'vendeurs') || 'general',
        is_published: data.is_published || false,
        scheduled_publish_at: (data as any).scheduled_publish_at ? new Date((data as any).scheduled_publish_at) : null,
        location_address: data.location_address || '',
        location_city: data.location_city || '',
        tags: data.tags || [],
        contact_phone: data.contact_phone || '',
        contact_phone_country: (data as any).contact_phone_country || '+33',
        contact_instagram: data.contact_instagram || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'article",
        variant: "destructive",
      });
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Ne pas modifier le contenu automatiquement - laisser l'utilisateur contrôler le contenu
      const formattedContent = formData.content;
      
      const postData = {
        ...formData,
        content: formattedContent,
        author_id: user?.id,
        excerpt: formData.excerpt || formData.content.substring(0, 200),
        scheduled_publish_at: formData.scheduled_publish_at ? formData.scheduled_publish_at.toISOString() : null
      };

      let error;
      
      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);
        error = insertError;
      }

      if (error) throw error;

      // Notifier que le sitemap doit être mis à jour si l'article est publié
      if (formData.is_published) {
        toast({
          title: "Succès",
          description: `Article ${isEditMode ? 'mis à jour' : 'créé'}. Pensez à régénérer le sitemap depuis la page Blog Admin.`,
        });
      } else {
        toast({
          title: "Succès",
          description: `Article ${isEditMode ? 'mis à jour' : 'créé'} avec succès`,
        });
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
      <header className="glass-strong sticky top-0 z-40 border-b border-border/20 pt-16 lg:pt-0">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/blog')}
                className="text-muted-foreground hover:text-foreground p-2 sm:px-4"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Retour au blog</span>
              </Button>
              <span className="text-lg sm:text-2xl font-normal text-foreground tracking-tight">
                {isEditMode ? 'Modifier l\'article' : 'Nouvel article'}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'article *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Entrez le titre de l'article"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Section *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'general' | 'restaurants' | 'associations' | 'vendeurs') => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Blog général</SelectItem>
                      <SelectItem value="restaurants">Restaurants</SelectItem>
                      <SelectItem value="associations">Associations</SelectItem>
                      <SelectItem value="vendeurs">Vendeurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Résumé/Extrait</Label>
                <RichTextEditor
                  value={formData.excerpt}
                  onChange={(excerpt) => setFormData(prev => ({ ...prev, excerpt }))}
                  placeholder="Entrez un résumé de l'article (optionnel, sera généré automatiquement si vide)"
                  rows={4}
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu de l'article *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Rédigez le contenu de votre article..."
                  rows={10}
                  className="min-h-[300px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="is_published">Publier immédiatement</Label>
                </div>

                {/* Publication programmée */}
                {!formData.is_published && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
                    <Label className="flex items-center text-sm font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      Programmer la publication
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.scheduled_publish_at && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.scheduled_publish_at ? (
                            format(formData.scheduled_publish_at, "PPP 'à' HH:mm", { locale: fr })
                          ) : (
                            <span>Sélectionner une date et heure</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.scheduled_publish_at || undefined}
                          onSelect={(date) => {
                            if (date) {
                              // Si une date existante est sélectionnée, conserver l'heure
                              const newDate = new Date(date);
                              if (formData.scheduled_publish_at) {
                                newDate.setHours(formData.scheduled_publish_at.getHours());
                                newDate.setMinutes(formData.scheduled_publish_at.getMinutes());
                              } else {
                                // Par défaut, programmer à 9h00
                                newDate.setHours(9, 0, 0, 0);
                              }
                              setFormData(prev => ({ ...prev, scheduled_publish_at: newDate }));
                            } else {
                              setFormData(prev => ({ ...prev, scheduled_publish_at: null }));
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                        {formData.scheduled_publish_at && (
                          <div className="p-3 border-t">
                            <Label className="text-sm font-medium mb-2 block">Heure de publication</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="time"
                                value={format(formData.scheduled_publish_at, "HH:mm")}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':');
                                  const newDate = new Date(formData.scheduled_publish_at!);
                                  newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                                  setFormData(prev => ({ ...prev, scheduled_publish_at: newDate }));
                                }}
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, scheduled_publish_at: null }))}
                              >
                                Effacer
                              </Button>
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    {formData.scheduled_publish_at && (
                      <p className="text-xs text-muted-foreground">
                        L'article sera publié automatiquement le {format(formData.scheduled_publish_at, "PPP 'à' HH:mm", { locale: fr })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Médias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  L'image sera automatiquement optimisée pour de meilleures performances SEO
                </p>
                <ImageUpload
                  images={formData.cover_image ? [formData.cover_image] : []}
                  onImagesChange={(images) => setFormData(prev => ({ 
                    ...prev, 
                    cover_image: images[0] || '' 
                  }))}
                  maxImages={1}
                  bucketName="blog-images"
                  className="mb-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Images supplémentaires</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Toutes les images seront compressées automatiquement (max 500KB chacune)
                </p>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ 
                    ...prev, 
                    images 
                  }))}
                  maxImages={10}
                  bucketName="blog-images"
                  firstImageLabel=""
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url" className="flex items-center">
                  <Video className="w-4 h-4 mr-2" />
                  URL de la vidéo (YouTube, Vimeo, etc.)
                </Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="Entrez l'URL de la vidéo"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location (for restaurants, associations, vendeurs) */}
          {(['restaurants', 'associations', 'vendeurs'].includes(formData.category)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location_address">Adresse complète</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                      placeholder="123 Rue de la Paix, 75001 Paris"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_city">Ville</Label>
                    <Input
                      id="location_city"
                      value={formData.location_city}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact (for vendeurs only) */}
          {formData.category === 'vendeurs' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Numéro de téléphone</Label>
                    <div className="flex space-x-2">
                      <CountrySelect
                        value={formData.contact_phone_country}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, contact_phone_country: value }))}
                        className="flex-shrink-0"
                      />
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="6 12 34 56 78"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_instagram">Lien Instagram</Label>
                    <Input
                      id="contact_instagram"
                      value={formData.contact_instagram}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_instagram: e.target.value }))}
                      placeholder="https://instagram.com/votre_compte"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} variant="outline" className="w-full sm:w-auto">
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="cursor-pointer text-sm px-3 py-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Analysis */}
          <SEOAnalyzer
            title={formData.title}
            excerpt={formData.excerpt}
            content={formData.content}
            images={formData.images}
            coverImage={formData.cover_image}
          />

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Aperçu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="prose max-w-none">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{formData.title || 'Titre de l\'article'}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <Badge className="w-fit">{getCategoryName(formData.category)}</Badge>
                  {formData.location_city && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {formData.location_city}
                    </div>
                  )}
                </div>
                {formData.cover_image && (
                  <img 
                    src={formData.cover_image} 
                    alt="Cover" 
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <MarkdownRenderer 
                  content={formData.content || 'Contenu de l\'article...'} 
                  className="text-sm sm:text-base break-words"
                />
                {formData.video_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground break-all">📹 Vidéo: {formData.video_url}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;