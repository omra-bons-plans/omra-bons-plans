-- Ajouter les colonnes pour gérer les sessions admin
ALTER TABLE public.admin_access_codes 
ADD COLUMN IF NOT EXISTS session_token TEXT,
ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMP WITH TIME ZONE;

-- Créer un index pour optimiser les recherches de session
CREATE INDEX IF NOT EXISTS idx_admin_session_token 
ON public.admin_access_codes(session_token) 
WHERE session_token IS NOT NULL;

-- Créer un index pour les codes non utilisés
CREATE INDEX IF NOT EXISTS idx_admin_codes_unused 
ON public.admin_access_codes(user_id, used_at) 
WHERE used_at IS NULL;