-- Create a table to store weather data
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  temperature INTEGER NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  humidity INTEGER,
  wind_speed DECIMAL(5,2),
  temp_max INTEGER,
  temp_min INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(city)
);

-- Enable RLS (but make it publicly readable since it's reference data)
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies for weather data
CREATE POLICY "Weather data is viewable by everyone" 
ON public.weather_data 
FOR SELECT 
USING (true);

-- Insert initial data for Makkah and Madinah
INSERT INTO public.weather_data (city, temperature, description, icon, humidity, wind_speed, last_updated)
VALUES 
  ('makkah', 35, 'Clear', '', 50, 5.0, now()),
  ('madinah', 32, 'Clear', '', 45, 3.0, now());