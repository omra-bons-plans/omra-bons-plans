-- Créer la table pour les articles de blog
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image text,
  images text[] DEFAULT '{}',
  video_url text,
  category text NOT NULL CHECK (category IN ('general', 'restaurants', 'associations', 'vendeurs')),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  location_address text,
  location_latitude numeric,
  location_longitude numeric,
  location_city text,
  tags text[] DEFAULT '{}',
  views_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  published_at timestamp with time zone
);

-- Index pour améliorer les performances
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX idx_blog_posts_location ON public.blog_posts(location_latitude, location_longitude);

-- Activer RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins : accès complet
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Politique pour voir les articles publiés (public)
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Politique pour les auteurs : gérer leurs propres articles
CREATE POLICY "Authors can manage their own blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Créer un trigger pour set published_at quand is_published devient true
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = now();
  ELSIF NEW.is_published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_blog_post_published_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_published_at();