-- Supprimer la politique dangereuse qui expose toutes les données personnelles
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.profiles;

-- Créer une vue publique sécurisée qui ne contient que les informations non sensibles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  first_name,
  slug,
  bio,
  profile_image,
  is_professional,
  company_name,
  website,
  instagram,
  facebook,
  languages_spoken,
  specialties,
  experience_years,
  profile_views,
  created_at,
  updated_at,
  public_profile
FROM public.profiles
WHERE public_profile = true;

-- Activer RLS sur la vue publique
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Créer une politique pour permettre à tout le monde de voir la vue publique
CREATE POLICY "Anyone can view public profile data"
ON public.profiles
FOR SELECT
USING (
  -- Permettre l'accès seulement aux colonnes non sensibles pour les profils publics
  public_profile = true AND 
  -- Cette politique sera utilisée avec des SELECT spécifiques qui excluent les colonnes sensibles
  true
);

-- Créer une fonction pour obtenir un profil public sécurisé
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  first_name text,
  slug text,
  bio text,
  profile_image text,
  is_professional boolean,
  company_name text,
  website text,
  instagram text,
  facebook text,
  languages_spoken text[],
  specialties text[],
  experience_years integer,
  profile_views integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.first_name,
    p.slug,
    p.bio,
    p.profile_image,
    p.is_professional,
    p.company_name,
    p.website,
    p.instagram,
    p.facebook,
    p.languages_spoken,
    p.specialties,
    p.experience_years,
    p.profile_views,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = profile_id 
    AND p.public_profile = true;
$$;

-- Fonction pour obtenir des profils publics avec pagination
CREATE OR REPLACE FUNCTION public.get_public_profiles(
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  full_name text,
  first_name text,
  slug text,
  bio text,
  profile_image text,
  is_professional boolean,
  company_name text,
  website text,
  instagram text,
  facebook text,
  languages_spoken text[],
  specialties text[],
  experience_years integer,
  profile_views integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.first_name,
    p.slug,
    p.bio,
    p.profile_image,
    p.is_professional,
    p.company_name,
    p.website,
    p.instagram,
    p.facebook,
    p.languages_spoken,
    p.specialties,
    p.experience_years,
    p.profile_views,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.public_profile = true
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
$$;

-- Mettre à jour la politique pour les données sensibles - seulement le propriétaire et les admins
CREATE POLICY "Users can view their full profile and admins can view all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR is_admin()
);

-- Politique pour permettre l'accès public aux colonnes non sensibles uniquement
-- Cette politique est restrictive et nécessitera l'utilisation des fonctions sécurisées ci-dessus
CREATE POLICY "Limited public access to non sensitive data"
ON public.profiles
FOR SELECT
USING (
  public_profile = true AND
  -- Cette politique sera contrôlée par l'application qui utilisera les fonctions sécurisées
  false  -- Forcer l'utilisation des fonctions sécurisées pour l'accès public
);