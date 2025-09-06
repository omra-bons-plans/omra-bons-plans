-- Add city column to ads_babysitting table
ALTER TABLE public.ads_babysitting 
ADD COLUMN city text NOT NULL DEFAULT '';

-- Update the default to null after adding the column
ALTER TABLE public.ads_babysitting 
ALTER COLUMN city DROP DEFAULT;