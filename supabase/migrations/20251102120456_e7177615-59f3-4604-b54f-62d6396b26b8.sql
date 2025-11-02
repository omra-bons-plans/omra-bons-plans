-- Create table for airline presets
CREATE TABLE IF NOT EXISTS public.airline_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  airline_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(airline_name)
);

-- Enable RLS
ALTER TABLE public.airline_presets ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage airline presets
CREATE POLICY "Admins can manage airline presets"
  ON public.airline_presets
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Function to increment airline usage count
CREATE OR REPLACE FUNCTION increment_airline_usage(p_airline_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.airline_presets (airline_name, usage_count)
  VALUES (p_airline_name, 1)
  ON CONFLICT (airline_name)
  DO UPDATE SET 
    usage_count = airline_presets.usage_count + 1,
    updated_at = now();
END;
$$;