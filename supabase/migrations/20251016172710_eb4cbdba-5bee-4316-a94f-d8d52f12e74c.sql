-- Étape 1: Supprimer l'ancienne contrainte AVANT de modifier les données
ALTER TABLE public.omra_offers 
DROP CONSTRAINT IF EXISTS omra_offers_formula_type_check;

-- Étape 2: Migrer toutes les anciennes formules vers les nouvelles
-- 'confort' reste 'confort', tout le reste devient 'essentiel'
UPDATE public.omra_offers 
SET formula_type = CASE 
  WHEN formula_type = 'confort' THEN 'confort'
  ELSE 'essentiel'
END
WHERE formula_type IN ('standard', 'premium', 'elite', 'autre', 'confort');

-- Étape 3: Supprimer les doublons (garder l'offre la plus récente)
DELETE FROM public.omra_offers a
USING public.omra_offers b
WHERE a.id < b.id
  AND a.agency_name = b.agency_name
  AND a.price_eur = b.price_eur
  AND a.month_departure = b.month_departure
  AND a.departure_city = b.departure_city
  AND a.formula_type = b.formula_type
  AND COALESCE(a.duration_nights, 0) = COALESCE(b.duration_nights, 0);

-- Étape 4: Ajouter la nouvelle contrainte (seulement "essentiel" et "confort")
ALTER TABLE public.omra_offers 
ADD CONSTRAINT omra_offers_formula_type_check 
CHECK (formula_type = ANY (ARRAY['essentiel'::text, 'confort'::text]));