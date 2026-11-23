-- Table pour tracer les tentatives de connexion admin (anti-brute-force)
CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  success boolean NOT NULL DEFAULT false,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes de rate-limiting (par user + date)
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_user_date
  ON public.admin_login_attempts (user_id, attempted_at);

-- RLS : seul le service role peut lire/écrire (Edge Functions uniquement)
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Nettoyage automatique : supprimer les tentatives de plus de 24h
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.admin_login_attempts
  WHERE attempted_at < now() - INTERVAL '24 hours';
END;
$$;
