-- Ajouter des colonnes pour les profils publics
ALTER TABLE public.profiles 
ADD COLUMN slug text UNIQUE,
ADD COLUMN public_profile boolean DEFAULT true,
ADD COLUMN bio text,
ADD COLUMN specialties text[],
ADD COLUMN experience_years integer,
ADD COLUMN profile_views integer DEFAULT 0,
ADD COLUMN profile_image text,
ADD COLUMN languages_spoken text[] DEFAULT '{}';

-- Créer une fonction pour générer des slugs automatiquement
CREATE OR REPLACE FUNCTION public.generate_profile_slug(user_full_name text, user_first_name text, user_id uuid)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Utiliser le nom complet ou le prénom pour créer le slug de base
  base_slug := COALESCE(user_full_name, user_first_name, 'user');
  
  -- Nettoyer le slug : minuscules, espaces -> tirets, caractères spéciaux supprimés
  base_slug := lower(trim(base_slug));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '[\s]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Si le slug est vide, utiliser l'ID
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'user-' || substr(user_id::text, 1, 8);
  END IF;
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un numéro si nécessaire
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Générer des slugs pour les profils existants
UPDATE public.profiles 
SET slug = public.generate_profile_slug(full_name, first_name, id)
WHERE slug IS NULL;

-- Créer un trigger pour générer automatiquement le slug lors de la création/mise à jour
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Générer le slug seulement s'il n'existe pas
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_profile_slug(NEW.full_name, NEW.first_name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_auto_generate_slug
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_slug();

-- Créer une table pour tracker les vues de profil
CREATE TABLE public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_profile_views_profile_id ON public.profile_views(profile_id);
CREATE INDEX idx_profile_views_created_at ON public.profile_views(created_at);

-- Activer RLS sur profile_views
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins : accès complet
CREATE POLICY "Admins can manage all profile views"
ON public.profile_views
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Politique pour voir les vues de son propre profil
CREATE POLICY "Users can view their own profile views"
ON public.profile_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = profile_views.profile_id 
    AND profiles.id = auth.uid()
  )
);

-- Politique pour insérer des vues (public pour le tracking)
CREATE POLICY "Anyone can insert profile views"
ON public.profile_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Mettre à jour les politiques RLS des profils pour permettre la vue publique
CREATE POLICY "Anyone can view public profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (public_profile = true);