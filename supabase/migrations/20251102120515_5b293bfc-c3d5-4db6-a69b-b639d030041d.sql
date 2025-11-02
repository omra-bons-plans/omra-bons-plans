-- Fix search_path for increment_airline_usage function
CREATE OR REPLACE FUNCTION increment_airline_usage(p_airline_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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