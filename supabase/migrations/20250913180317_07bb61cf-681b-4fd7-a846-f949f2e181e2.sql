-- Ajouter les champs bagages à main pour les annonces vols et séjours
ALTER TABLE public.ads_vols 
ADD COLUMN carry_on_bags_count integer DEFAULT 1,
ADD COLUMN carry_on_bags_weight integer DEFAULT 10;

ALTER TABLE public.ads_sejours 
ADD COLUMN carry_on_bags_count integer DEFAULT 1,
ADD COLUMN carry_on_bags_weight integer DEFAULT 10;