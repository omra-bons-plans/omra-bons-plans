-- Ajouter le champ slug à la table blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN slug TEXT;

-- Créer un index unique sur le slug pour garantir l'unicité et améliorer les performances
CREATE UNIQUE INDEX idx_blog_posts_slug ON public.blog_posts (slug);

-- Fonction pour générer un slug à partir d'un titre
CREATE OR REPLACE FUNCTION public.generate_blog_slug(
  title_text TEXT,
  post_id UUID DEFAULT NULL
) 
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Nettoyer le titre pour créer le slug de base
  base_slug := LOWER(TRIM(title_text));
  
  -- Remplacer les caractères spéciaux et espaces
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '[\s]+', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  base_slug := TRIM(base_slug, '-');
  
  -- Si le slug est vide après nettoyage, utiliser un slug par défaut
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'article';
  END IF;
  
  -- Limiter la longueur du slug
  IF LENGTH(base_slug) > 100 THEN
    base_slug := SUBSTRING(base_slug, 1, 100);
    base_slug := TRIM(base_slug, '-');
  END IF;
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un numéro si nécessaire
  WHILE EXISTS (
    SELECT 1 FROM public.blog_posts 
    WHERE slug = final_slug 
    AND (post_id IS NULL OR id != post_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Fonction trigger pour générer automatiquement le slug
CREATE OR REPLACE FUNCTION public.auto_generate_blog_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Générer le slug seulement s'il n'existe pas ou si le titre a changé
  IF NEW.slug IS NULL OR NEW.slug = '' OR (TG_OP = 'UPDATE' AND OLD.title != NEW.title) THEN
    NEW.slug := public.generate_blog_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Créer le trigger
CREATE TRIGGER trigger_auto_generate_blog_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_blog_slug();

-- Générer des slugs pour les articles existants
UPDATE public.blog_posts 
SET slug = public.generate_blog_slug(title, id)
WHERE slug IS NULL OR slug = '';