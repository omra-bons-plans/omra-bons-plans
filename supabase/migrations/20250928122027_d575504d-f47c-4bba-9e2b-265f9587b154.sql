-- Ajouter une colonne pour stocker les tarifs dans ads_chauffeurs
ALTER TABLE public.ads_chauffeurs 
ADD COLUMN pricing JSONB;

-- Ajouter un commentaire pour expliquer le format des tarifs
COMMENT ON COLUMN public.ads_chauffeurs.pricing IS 'Stockage des tarifs au format JSON: {"airport_jeddah_makkah": 100, "airport_jeddah_medina": 150, ...}';