-- Ajouter les colonnes pour les étoiles des hôtels
ALTER TABLE public.omra_offers 
ADD COLUMN IF NOT EXISTS hotel_makkah_stars integer,
ADD COLUMN IF NOT EXISTS hotel_medina_stars integer;

-- Ajouter également à la table staging
ALTER TABLE public.omra_offers_next
ADD COLUMN IF NOT EXISTS hotel_makkah_stars integer,
ADD COLUMN IF NOT EXISTS hotel_medina_stars integer;