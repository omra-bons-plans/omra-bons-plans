-- Ajouter la colonne airline à la table omra_offers
ALTER TABLE public.omra_offers 
ADD COLUMN IF NOT EXISTS airline text;

-- Ajouter un index pour optimiser les recherches par compagnie aérienne
CREATE INDEX IF NOT EXISTS idx_omra_offers_airline 
ON public.omra_offers(airline) 
WHERE airline IS NOT NULL;

-- Commenter la colonne
COMMENT ON COLUMN public.omra_offers.airline IS 'Nom de la compagnie aérienne (ex: Saudi Airlines, Air France, etc.)';
