-- Add pricing column to ads_guides table
ALTER TABLE public.ads_guides 
ADD COLUMN pricing jsonb;