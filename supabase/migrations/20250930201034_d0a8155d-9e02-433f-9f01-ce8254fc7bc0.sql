-- Ajouter des champs pour la sécurité renforcée
ALTER TABLE public.admin_access_codes
ADD COLUMN IF NOT EXISTS session_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS session_ip INET,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;

-- Index pour améliorer les performances des vérifications de session
CREATE INDEX IF NOT EXISTS idx_admin_access_codes_session_token 
ON public.admin_access_codes(session_token) 
WHERE session_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_admin_access_codes_session_expires 
ON public.admin_access_codes(session_expires_at) 
WHERE session_expires_at IS NOT NULL;

-- Fonction pour vérifier et mettre à jour une session admin active
CREATE OR REPLACE FUNCTION public.verify_admin_session(
  p_session_token TEXT,
  p_user_id UUID,
  p_current_ip INET
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_is_valid BOOLEAN := false;
  v_error_message TEXT := '';
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT public.has_role(p_user_id, 'admin') THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Utilisateur non autorisé'
    );
  END IF;

  -- Récupérer la session
  SELECT * INTO v_session
  FROM public.admin_access_codes
  WHERE session_token = p_session_token
    AND user_id = p_user_id
    AND used_at IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;

  -- Vérifier l'existence de la session
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Session invalide ou expirée'
    );
  END IF;

  -- Vérifier l'expiration de la session (30 minutes d'inactivité)
  IF v_session.session_expires_at IS NOT NULL 
     AND v_session.session_expires_at < NOW() THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Session expirée. Veuillez vous reconnecter.',
      'expired', true
    );
  END IF;

  -- Vérifier le binding IP (alerte si changement mais accepter quand même)
  IF v_session.session_ip IS NOT NULL 
     AND v_session.session_ip != p_current_ip THEN
    v_error_message := 'Alerte: Changement d''IP détecté';
  END IF;

  -- Mettre à jour l'activité et prolonger la session de 30 minutes
  UPDATE public.admin_access_codes
  SET 
    last_activity_at = NOW(),
    session_expires_at = NOW() + INTERVAL '30 minutes'
  WHERE session_token = p_session_token;

  RETURN jsonb_build_object(
    'valid', true,
    'warning', v_error_message,
    'session_expires_at', (NOW() + INTERVAL '30 minutes')::text
  );
END;
$$;