-- Table pour stocker les codes de vérification admin
CREATE TABLE IF NOT EXISTS public.admin_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT
);

-- Index pour améliorer les performances
CREATE INDEX idx_admin_access_codes_user_id ON public.admin_access_codes(user_id);
CREATE INDEX idx_admin_access_codes_expires_at ON public.admin_access_codes(expires_at);

-- RLS policies
ALTER TABLE public.admin_access_codes ENABLE ROW LEVEL SECURITY;

-- Les admins peuvent voir leurs propres codes
CREATE POLICY "Admins can view their own codes"
ON public.admin_access_codes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Fonction de nettoyage automatique des codes expirés (appelée par cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_access_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$;