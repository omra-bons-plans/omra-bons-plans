-- Supprimer et recréer la fonction get_public_profile avec le slug
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  slug text,
  full_name text,
  first_name text,
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
    p.slug,
    p.full_name,
    p.first_name,
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