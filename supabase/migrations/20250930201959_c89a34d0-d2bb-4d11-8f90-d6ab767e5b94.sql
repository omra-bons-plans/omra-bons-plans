-- Ajouter des champs pour le rate limiting et device fingerprinting
ALTER TABLE public.admin_access_codes
ADD COLUMN IF NOT EXISTS request_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Index pour améliorer les performances des requêtes de rate limiting
CREATE INDEX IF NOT EXISTS idx_admin_codes_user_requests 
ON public.admin_access_codes(user_id, last_request_at DESC);

-- Fonction pour vérifier le rate limiting (max 3 codes par heure)
CREATE OR REPLACE FUNCTION public.check_admin_code_rate_limit(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent_requests INTEGER;
  v_oldest_request TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Compter les demandes dans la dernière heure
  SELECT COUNT(*), MIN(created_at)
  INTO v_recent_requests, v_oldest_request
  FROM public.admin_access_codes
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Si plus de 3 requêtes dans la dernière heure
  IF v_recent_requests >= 3 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'error', 'Trop de tentatives. Réessayez dans ' || 
               EXTRACT(MINUTE FROM (v_oldest_request + INTERVAL '1 hour' - NOW()))::INTEGER || 
               ' minutes.',
      'retry_after', v_oldest_request + INTERVAL '1 hour'
    );
  END IF;
  
  RETURN jsonb_build_object('allowed', true);
END;
$$;

-- Fonction pour détecter un nouveau device/IP
CREATE OR REPLACE FUNCTION public.check_admin_device_fingerprint(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_device_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_known_device BOOLEAN;
BEGIN
  -- Vérifier si cet appareil/IP a déjà été utilisé avec succès
  SELECT EXISTS(
    SELECT 1
    FROM public.admin_access_codes
    WHERE user_id = p_user_id
      AND used_at IS NOT NULL
      AND (
        session_ip = p_ip_address OR
        device_fingerprint = p_device_fingerprint OR
        user_agent = p_user_agent
      )
      AND created_at > NOW() - INTERVAL '30 days'
  ) INTO v_known_device;
  
  -- Si c'est un nouvel appareil/IP, marquer comme suspect
  IF NOT v_known_device THEN
    RETURN jsonb_build_object(
      'is_new_device', true,
      'warning', '⚠️ Nouveau device/IP détecté',
      'requires_confirmation', true
    );
  END IF;
  
  RETURN jsonb_build_object(
    'is_new_device', false,
    'requires_confirmation', false
  );
END;
$$;

-- Fonction de nettoyage automatique des anciens codes (plus de 24h)
CREATE OR REPLACE FUNCTION public.cleanup_old_admin_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_access_codes
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;