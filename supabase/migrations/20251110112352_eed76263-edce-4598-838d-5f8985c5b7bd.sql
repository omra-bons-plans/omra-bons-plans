-- Créer la table des agences
CREATE TABLE public.agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  google_search_url TEXT,
  google_rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  price_range TEXT NOT NULL,
  highlight TEXT NOT NULL,
  last_review_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Politique pour que tout le monde puisse voir les agences
CREATE POLICY "Anyone can view agencies"
ON public.agencies
FOR SELECT
USING (true);

-- Politique pour que les admins puissent gérer les agences
CREATE POLICY "Admins can manage agencies"
ON public.agencies
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_agencies_updated_at
BEFORE UPDATE ON public.agencies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les recherches
CREATE INDEX idx_agencies_name ON public.agencies(name);
CREATE INDEX idx_agencies_google_rating ON public.agencies(google_rating DESC);