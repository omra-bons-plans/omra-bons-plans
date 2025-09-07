-- Ajouter les champs bagages pour les vols
ALTER TABLE public.ads_vols 
ADD COLUMN checked_bags_count INTEGER DEFAULT 0,
ADD COLUMN checked_bags_weight INTEGER DEFAULT 20;

-- Ajouter les champs bagages pour les séjours  
ALTER TABLE public.ads_sejours
ADD COLUMN checked_bags_count INTEGER DEFAULT 0,
ADD COLUMN checked_bags_weight INTEGER DEFAULT 20;

-- Commenter les colonnes pour la documentation
COMMENT ON COLUMN public.ads_vols.checked_bags_count IS 'Nombre de bagages en soute inclus';
COMMENT ON COLUMN public.ads_vols.checked_bags_weight IS 'Poids en kilos de chaque bagage en soute';
COMMENT ON COLUMN public.ads_sejours.checked_bags_count IS 'Nombre de bagages en soute inclus';
COMMENT ON COLUMN public.ads_sejours.checked_bags_weight IS 'Poids en kilos de chaque bagage en soute';