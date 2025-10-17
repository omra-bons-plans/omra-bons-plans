-- Supprimer les policies existantes si elles existent
DROP POLICY IF EXISTS "Admins can view scraping attempts" ON public.scraping_attempts;
DROP POLICY IF EXISTS "Service role can manage scraping attempts" ON public.scraping_attempts;

-- Supprimer les index s'ils existent
DROP INDEX IF EXISTS public.idx_scraping_attempts_ip;
DROP INDEX IF EXISTS public.idx_scraping_attempts_blocked;

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS public.scraping_attempts;

-- Créer la table pour logger les tentatives de scraping suspectes
CREATE TABLE public.scraping_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  user_agent TEXT,
  request_path TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  is_blocked BOOLEAN DEFAULT false,
  blocked_reason TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour recherches rapides par IP
CREATE INDEX idx_scraping_attempts_ip ON public.scraping_attempts(ip_address);
CREATE INDEX idx_scraping_attempts_blocked ON public.scraping_attempts(is_blocked);

-- Activer RLS
ALTER TABLE public.scraping_attempts ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les tentatives de scraping
CREATE POLICY "Admins can view scraping attempts"
  ON public.scraping_attempts
  FOR SELECT
  USING (public.is_admin());

-- Permettre l'insertion depuis n'importe où (pour logging)
CREATE POLICY "Anyone can log scraping attempts"
  ON public.scraping_attempts
  FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE public.scraping_attempts IS 'Table pour détecter et bloquer les tentatives de scraping du site';