-- Créer une table pour stocker les inscriptions à la newsletter Hajj
CREATE TABLE IF NOT EXISTS public.hajj_newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  CONSTRAINT hajj_newsletter_email_unique UNIQUE (email)
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_hajj_newsletter_email ON public.hajj_newsletter_subscriptions(email);

-- Activer RLS
ALTER TABLE public.hajj_newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre à tout le monde d'insérer une inscription
CREATE POLICY "Anyone can subscribe to Hajj newsletter"
  ON public.hajj_newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Policy pour permettre aux admins de voir toutes les inscriptions
CREATE POLICY "Admins can view all Hajj newsletter subscriptions"
  ON public.hajj_newsletter_subscriptions
  FOR SELECT
  USING (public.is_admin());

-- Ajouter un commentaire sur la table
COMMENT ON TABLE public.hajj_newsletter_subscriptions IS 'Table pour stocker les emails des personnes qui souhaitent être notifiées des offres Hajj 2026';