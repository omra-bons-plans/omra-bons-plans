-- Promouvoir l'utilisateur fafaland@hotmail.fr en tant qu'administrateur
INSERT INTO public.user_roles (user_id, role)
VALUES ('7c49a2e1-5b15-4ebe-9a5c-9023eed550d3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;