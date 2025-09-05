-- Update RLS policy to handle ads without expiration dates (for guides, chauffeurs, babysitting)
-- They should be visible if published, not draft, and not paused
DROP POLICY IF EXISTS "Anyone can view published ads" ON public.ads;

CREATE POLICY "Anyone can view published ads" 
ON public.ads 
FOR SELECT 
USING (
  (is_published = true) 
  AND (is_draft = false) 
  AND (is_paused = false)
  AND (
    -- For ads with expiration dates (sejours, vols, hebergement)
    (publish_end_date IS NOT NULL AND publish_end_date > now())
    OR 
    -- For ads without expiration dates (guides, chauffeurs, babysitting)
    (publish_end_date IS NULL AND category IN ('guides', 'chauffeurs', 'babysitting'))
  )
);