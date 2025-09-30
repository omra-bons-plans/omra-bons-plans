-- Fonction pour auto-autoriser un appareil après vérification du code
CREATE OR REPLACE FUNCTION public.authorize_admin_device_auto(
  p_admin_user_id UUID,
  p_device_fingerprint TEXT,
  p_ip_address INET,
  p_user_agent TEXT,
  p_expiry_days INTEGER DEFAULT 90
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_auth RECORD;
  v_auth_id UUID;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT public.has_role(p_admin_user_id, 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Utilisateur non autorisé'
    );
  END IF;

  -- Vérifier s'il existe déjà une autorisation approuvée valide
  SELECT * INTO v_existing_auth
  FROM public.admin_device_authorizations
  WHERE admin_user_id = p_admin_user_id
    AND device_fingerprint = p_device_fingerprint
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY authorized_at DESC
  LIMIT 1;

  -- Si autorisation valide existe déjà, prolonger sa durée
  IF FOUND THEN
    UPDATE public.admin_device_authorizations
    SET 
      expires_at = NOW() + (p_expiry_days || ' days')::INTERVAL,
      updated_at = NOW()
    WHERE id = v_existing_auth.id;
    
    RETURN jsonb_build_object(
      'success', true,
      'action', 'extended',
      'auth_id', v_existing_auth.id
    );
  END IF;

  -- Chercher une demande en attente existante
  SELECT id INTO v_auth_id
  FROM public.admin_device_authorizations
  WHERE admin_user_id = p_admin_user_id
    AND device_fingerprint = p_device_fingerprint
    AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Si demande en attente existe, l'approuver
  IF FOUND THEN
    UPDATE public.admin_device_authorizations
    SET 
      status = 'approved',
      authorized_by = p_admin_user_id,
      authorized_at = NOW(),
      expires_at = NOW() + (p_expiry_days || ' days')::INTERVAL,
      notes = '✅ Auto-approuvé après vérification du code par email',
      updated_at = NOW()
    WHERE id = v_auth_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'action', 'approved',
      'auth_id', v_auth_id
    );
  END IF;

  -- Sinon, créer une nouvelle autorisation approuvée
  INSERT INTO public.admin_device_authorizations (
    admin_user_id,
    device_fingerprint,
    ip_address,
    user_agent,
    status,
    authorized_by,
    authorized_at,
    expires_at,
    notes
  ) VALUES (
    p_admin_user_id,
    p_device_fingerprint,
    p_ip_address,
    p_user_agent,
    'approved',
    p_admin_user_id,
    NOW(),
    NOW() + (p_expiry_days || ' days')::INTERVAL,
    '✅ Auto-approuvé après vérification du code par email'
  )
  RETURNING id INTO v_auth_id;

  RETURN jsonb_build_object(
    'success', true,
    'action', 'created',
    'auth_id', v_auth_id
  );
END;
$$;