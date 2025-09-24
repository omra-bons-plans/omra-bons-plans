-- Table pour l'audit des changements de rôles
CREATE TABLE public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  target_user_id UUID NOT NULL REFERENCES auth.users(id),
  old_role app_role,
  new_role app_role NOT NULL,
  action_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS sur la table d'audit
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les logs d'audit
CREATE POLICY "Admins can view role audit logs"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fonction sécurisée pour changer les rôles avec audit
CREATE OR REPLACE FUNCTION public.secure_role_change(
  target_user_id UUID,
  new_role app_role,
  admin_ip INET DEFAULT NULL,
  admin_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_id UUID;
  old_role app_role;
  target_email TEXT;
  admin_email TEXT;
BEGIN
  -- Vérifier que l'utilisateur actuel est admin
  admin_id := auth.uid();
  IF NOT public.has_role(admin_id, 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Access denied: Admin role required');
  END IF;

  -- Récupérer l'ancien rôle
  SELECT role INTO old_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id;

  -- Récupérer les emails pour les logs
  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;
  SELECT email INTO admin_email FROM auth.users WHERE id = admin_id;

  -- PROTECTION CRITIQUE: Empêcher l'auto-modification du rôle admin principal
  IF target_user_id = admin_id AND old_role = 'admin' AND new_role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot modify your own admin role');
  END IF;

  -- PROTECTION: Empêcher la modification du compte admin principal (fafaland@hotmail.fr)
  IF target_email = 'fafaland@hotmail.fr' AND new_role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot modify the primary admin account');
  END IF;

  -- Supprimer l'ancien rôle
  DELETE FROM public.user_roles WHERE user_id = target_user_id;

  -- Ajouter le nouveau rôle
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role);

  -- Logger l'action dans l'audit
  INSERT INTO public.role_audit_log (
    admin_user_id, 
    target_user_id, 
    old_role, 
    new_role, 
    ip_address, 
    user_agent
  ) VALUES (
    admin_id, 
    target_user_id, 
    old_role, 
    new_role, 
    admin_ip, 
    admin_user_agent
  );

  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Role updated successfully',
    'old_role', old_role,
    'new_role', new_role,
    'admin_email', admin_email,
    'target_email', target_email
  );
END;
$$;

-- Fonction pour voir les tentatives de changement de rôles
CREATE OR REPLACE FUNCTION public.get_recent_role_changes(limit_count INTEGER DEFAULT 50)
RETURNS TABLE(
  action_timestamp TIMESTAMP WITH TIME ZONE,
  admin_email TEXT,
  target_email TEXT,
  old_role app_role,
  new_role app_role,
  ip_address INET
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Seuls les admins peuvent voir l'audit
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    ral.action_timestamp,
    au.email as admin_email,
    tu.email as target_email,
    ral.old_role,
    ral.new_role,
    ral.ip_address
  FROM public.role_audit_log ral
  JOIN auth.users au ON ral.admin_user_id = au.id
  JOIN auth.users tu ON ral.target_user_id = tu.id
  ORDER BY ral.action_timestamp DESC
  LIMIT limit_count;
END;
$$;