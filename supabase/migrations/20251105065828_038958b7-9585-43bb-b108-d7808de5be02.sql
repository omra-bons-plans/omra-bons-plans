-- Ajouter le champ is_recommended aux tables d'offres Omra
ALTER TABLE public.omra_offers
ADD COLUMN is_recommended boolean NOT NULL DEFAULT false;

ALTER TABLE public.omra_offers_next
ADD COLUMN is_recommended boolean NOT NULL DEFAULT false;

-- Ajouter un index pour optimiser les requêtes filtrant les offres recommandées
CREATE INDEX idx_omra_offers_recommended ON public.omra_offers(is_recommended) WHERE is_recommended = true;
CREATE INDEX idx_omra_offers_next_recommended ON public.omra_offers_next(is_recommended) WHERE is_recommended = true;