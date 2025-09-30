-- Table pour les autorisations d'appareils admin
CREATE TABLE IF NOT EXISTS public.admin_device_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  authorized_by UUID,
  authorized_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_admin_device_auth_user ON public.admin_device_authorizations(admin_user_id);
CREATE INDEX idx_admin_device_auth_fingerprint ON public.admin_device_authorizations(device_fingerprint);
CREATE INDEX idx_admin_device_auth_status ON public.admin_device_authorizations(status);

-- RLS
ALTER TABLE public.admin_device_authorizations ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins (voir leurs propres demandes)
CREATE POLICY "Admins can view their own authorization requests"
ON public.admin_device_authorizations
FOR SELECT
USING (auth.uid() = admin_user_id OR public.has_role(auth.uid(), 'admin'));

-- Politique pour les super-admins (gérer toutes les autorisations)
CREATE POLICY "Super admins can manage all authorizations"
ON public.admin_device_authorizations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fonction pour créer une demande d'autorisation
CREATE OR REPLACE FUNCTION public.request_device_authorization(
  p_admin_user_id UUID,
  p_device_fingerprint TEXT,
  p_ip_address INET,
  p_user_agent TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_existing_auth RECORD;
BEGIN
  -- Vérifier s'il existe déjà une autorisation valide
  SELECT * INTO v_existing_auth
  FROM public.admin_device_authorizations
  WHERE admin_user_id = p_admin_user_id
    AND device_fingerprint = p_device_fingerprint
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY authorized_at DESC
  LIMIT 1;

  -- Si autorisation valide existe, retourner son ID
  IF FOUND THEN
    RETURN v_existing_auth.id;
  END IF;

  -- Vérifier s'il existe déjà une demande en attente
  SELECT id INTO v_request_id
  FROM public.admin_device_authorizations
  WHERE admin_user_id = p_admin_user_id
    AND device_fingerprint = p_device_fingerprint
    AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Si demande en attente existe, retourner son ID
  IF FOUND THEN
    RETURN v_request_id;
  END IF;

  -- Créer une nouvelle demande
  INSERT INTO public.admin_device_authorizations (
    admin_user_id,
    device_fingerprint,
    ip_address,
    user_agent,
    status
  ) VALUES (
    p_admin_user_id,
    p_device_fingerprint,
    p_ip_address,
    p_user_agent,
    'pending'
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$;

-- Fonction pour autoriser/refuser un appareil
CREATE OR REPLACE FUNCTION public.authorize_admin_device(
  p_request_id UUID,
  p_authorizer_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL,
  p_expiry_days INTEGER DEFAULT 90
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request RECORD;
BEGIN
  -- Vérifier que l'authorizer est admin
  IF NOT public.has_role(p_authorizer_id, 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Seuls les super-admins peuvent autoriser des appareils'
    );
  END IF;

  -- Récupérer la demande
  SELECT * INTO v_request
  FROM public.admin_device_authorizations
  WHERE id = p_request_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Demande introuvable'
    );
  END IF;

  -- Vérifier que la demande est en attente
  IF v_request.status != 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Demande déjà traitée'
    );
  END IF;

  -- Mettre à jour la demande
  IF p_action = 'approve' THEN
    UPDATE public.admin_device_authorizations
    SET 
      status = 'approved',
      authorized_by = p_authorizer_id,
      authorized_at = NOW(),
      expires_at = NOW() + (p_expiry_days || ' days')::INTERVAL,
      notes = p_notes,
      updated_at = NOW()
    WHERE id = p_request_id;
  ELSIF p_action = 'reject' THEN
    UPDATE public.admin_device_authorizations
    SET 
      status = 'rejected',
      authorized_by = p_authorizer_id,
      authorized_at = NOW(),
      notes = p_notes,
      updated_at = NOW()
    WHERE id = p_request_id;
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Action invalide'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'action', p_action,
    'request_id', p_request_id
  );
END;
$$;

-- Fonction pour vérifier si un appareil est autorisé
CREATE OR REPLACE FUNCTION public.check_device_authorization(
  p_admin_user_id UUID,
  p_device_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auth RECORD;
BEGIN
  -- Chercher une autorisation valide
  SELECT * INTO v_auth
  FROM public.admin_device_authorizations
  WHERE admin_user_id = p_admin_user_id
    AND device_fingerprint = p_device_fingerprint
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY authorized_at DESC
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'authorized', true,
      'expires_at', v_auth.expires_at,
      'authorized_at', v_auth.authorized_at
    );
  END IF;

  RETURN jsonb_build_object(
    'authorized', false
  );
END;
$$;

-- Trigger pour updated_at
CREATE TRIGGER update_admin_device_auth_updated_at
BEFORE UPDATE ON public.admin_device_authorizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();