-- Corriger la casse de la ville de départ pour Haramain Voyages
UPDATE public.hajj_offers
SET departure_cities = ARRAY['Paris']
WHERE agency_name = 'Haramain Voyages' AND departure_cities = ARRAY['paris'];