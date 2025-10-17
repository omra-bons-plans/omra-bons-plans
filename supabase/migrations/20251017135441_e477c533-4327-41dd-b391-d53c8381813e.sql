-- Table pour logger les tentatives de scraping suspectes
CREATE TABLE IF NOT EXISTS public.scraping_attempts (
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
CREATE INDEX IF NOT EXISTS idx_scraping_attempts_ip ON public.scraping_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_scraping_attempts_blocked ON public.scraping_attempts(is_blocked);

-- Activer RLS
ALTER TABLE public.scraping_attempts ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les tentatives de scraping
CREATE POLICY "Admins can view scraping attempts"
  ON public.scraping_attempts
  FOR SELECT
  USING (public.is_admin());

-- Le service role peut insérer/mettre à jour
CREATE POLICY "Service role can manage scraping attempts"
  ON public.scraping_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.scraping_attempts IS 'Table pour détecter et bloquer les tentatives de scraping du site';