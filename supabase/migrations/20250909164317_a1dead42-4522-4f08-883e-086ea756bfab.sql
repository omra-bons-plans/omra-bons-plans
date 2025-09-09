-- Corriger la politique RLS pour l'affichage public des articles de blog
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

-- Créer une nouvelle politique plus simple et claire
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts
FOR SELECT
TO public
USING (is_published = true);