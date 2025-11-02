-- Create table for storing hotel presets
CREATE TABLE IF NOT EXISTS public.hotel_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('makkah', 'medina')),
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_name, city)
);

-- Enable RLS
ALTER TABLE public.hotel_presets ENABLE ROW LEVEL SECURITY;

-- Admins can manage hotel presets
CREATE POLICY "Admins can manage hotel presets"
ON public.hotel_presets
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for faster searches
CREATE INDEX idx_hotel_presets_name ON public.hotel_presets(hotel_name);
CREATE INDEX idx_hotel_presets_city ON public.hotel_presets(city);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_hotel_usage(p_hotel_name TEXT, p_city TEXT, p_stars INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO public.hotel_presets (hotel_name, city, stars, usage_count)
  VALUES (p_hotel_name, p_city, p_stars, 1)
  ON CONFLICT (hotel_name, city) 
  DO UPDATE SET 
    usage_count = hotel_presets.usage_count + 1,
    stars = EXCLUDED.stars,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;