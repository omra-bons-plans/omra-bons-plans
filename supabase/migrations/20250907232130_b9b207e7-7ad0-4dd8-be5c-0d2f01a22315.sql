-- Supprimer la vue problématique avec security_barrier
DROP VIEW IF EXISTS public.public_profiles;

-- Supprimer la politique problématique
DROP POLICY IF EXISTS "Anyone can view public profile data" ON public.profiles;
DROP POLICY IF EXISTS "Limited public access to non sensitive data" ON public.profiles;

-- Recréer les fonctions avec un search_path fixe et sécurisé
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
SET search_path = 'public'
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

-- Fonction pour obtenir des profils publics avec pagination et search_path fixe
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
SET search_path = 'public'
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

-- Créer une politique restrictive qui permet seulement aux utilisateurs de voir leur propre profil
-- et aux admins de voir tous les profils
CREATE POLICY "Secure profile access"
ON public.profiles
FOR SELECT
USING (
  -- Les utilisateurs peuvent voir leur propre profil complet
  auth.uid() = id 
  OR 
  -- Les admins peuvent voir tous les profils
  is_admin()
);

-- IMPORTANT: Pour l'accès public aux profils, l'application devra utiliser 
-- les fonctions get_public_profile() et get_public_profiles() qui exposent
-- seulement les données non sensibles des profils publics