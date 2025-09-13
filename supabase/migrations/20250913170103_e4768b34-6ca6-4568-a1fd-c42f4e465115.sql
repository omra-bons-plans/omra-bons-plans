-- Add airport information to sejours table
ALTER TABLE public.ads_sejours 
ADD COLUMN departure_airport text,
ADD COLUMN arrival_airport text;