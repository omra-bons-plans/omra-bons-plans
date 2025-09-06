-- Créer la table pour tracker les clics sur les annonces et boutons contact
CREATE TABLE public.click_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  click_type text NOT NULL CHECK (click_type IN ('ad_view', 'contact_view')),
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances des requêtes de statistiques
CREATE INDEX idx_click_stats_ad_id ON public.click_stats(ad_id);
CREATE INDEX idx_click_stats_type ON public.click_stats(click_type);
CREATE INDEX idx_click_stats_created_at ON public.click_stats(created_at);
CREATE INDEX idx_click_stats_ad_type ON public.click_stats(ad_id, click_type);

-- Activer RLS
ALTER TABLE public.click_stats ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins : accès complet
CREATE POLICY "Admins can manage all click stats"
ON public.click_stats
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Politique pour voir les stats de ses propres annonces
CREATE POLICY "Users can view stats of their own ads"
ON public.click_stats
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.ads 
    WHERE ads.id = click_stats.ad_id 
    AND ads.user_id = auth.uid()
  )
);

-- Politique pour insérer des clics (public pour le tracking)
CREATE POLICY "Anyone can insert click stats"
ON public.click_stats
FOR INSERT
TO anon, authenticated
WITH CHECK (true);