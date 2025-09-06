-- Créer une fonction pour vérifier si une annonce est expirée
CREATE OR REPLACE FUNCTION public.is_ad_expired(publish_end_date timestamp with time zone)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT publish_end_date IS NOT NULL AND publish_end_date <= now()
$$;

-- Créer une fonction pour vérifier si une annonce doit être supprimée (expirée depuis plus de 7 jours)
CREATE OR REPLACE FUNCTION public.should_auto_delete_ad(publish_end_date timestamp with time zone)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT publish_end_date IS NOT NULL AND publish_end_date <= (now() - interval '7 days')
$$;

-- Modifier les politiques RLS pour permettre l'affichage des annonces expirées (mais pas supprimées automatiquement)
DROP POLICY IF EXISTS "Anyone can view published ads" ON ads;

CREATE POLICY "Anyone can view published and expired ads"
ON ads FOR SELECT
TO public
USING (
  (is_published = true) AND 
  (is_draft = false) AND 
  (is_paused = false) AND
  (
    -- Annonces actives (non expirées)
    (publish_end_date IS NULL OR publish_end_date > now()) OR
    -- Annonces expirées mais pas encore supprimées automatiquement (moins de 7 jours)
    (publish_end_date IS NOT NULL AND publish_end_date <= now() AND publish_end_date > (now() - interval '7 days'))
  ) AND
  -- Exclure les catégories spéciales sans date d'expiration
  (category NOT IN ('guides', 'chauffeurs', 'babysitting') OR publish_end_date IS NOT NULL)
);

-- Modifier la politique de suppression pour empêcher les utilisateurs de supprimer leurs annonces expirées
DROP POLICY IF EXISTS "Users can delete their own ads" ON ads;

CREATE POLICY "Users can delete their own active ads only"
ON ads FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id AND
  -- L'utilisateur ne peut supprimer que ses annonces non expirées
  (publish_end_date IS NULL OR publish_end_date > now())
);

-- Les admins peuvent toujours tout supprimer (politique existante reste active)