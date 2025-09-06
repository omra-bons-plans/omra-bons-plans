-- Fix ads_chauffeurs table to support multiple cities
-- Drop the existing city check constraint
ALTER TABLE public.ads_chauffeurs DROP CONSTRAINT ads_chauffeurs_city_check;

-- Change city column from text to text array
ALTER TABLE public.ads_chauffeurs ALTER COLUMN city TYPE text[] USING ARRAY[city];

-- Add new constraint for city array values
ALTER TABLE public.ads_chauffeurs ADD CONSTRAINT ads_chauffeurs_cities_check 
CHECK (
  city <@ ARRAY['makkah', 'medina', 'jeddah'] AND 
  array_length(city, 1) > 0
);