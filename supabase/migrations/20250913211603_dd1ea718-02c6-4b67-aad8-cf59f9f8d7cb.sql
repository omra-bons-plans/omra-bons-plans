-- Corriger la fonction pour utiliser uniquement le type 'general' existant
CREATE OR REPLACE FUNCTION public.notify_admins_new_topic_request()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get all admin users and create notifications
  FOR admin_user_id IN 
    SELECT ur.user_id 
    FROM public.user_roles ur 
    WHERE ur.role = 'admin'
  LOOP
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      related_type,
      related_id
    ) VALUES (
      admin_user_id,
      'system'::notification_type,
      'Nouveau sujet proposé',
      'Un utilisateur souhaite créer un nouveau sujet : "' || NEW.title || '"',
      'topic_request',
      NEW.id
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;