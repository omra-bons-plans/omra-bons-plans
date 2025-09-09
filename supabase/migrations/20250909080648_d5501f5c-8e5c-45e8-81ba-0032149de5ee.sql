-- Force manual weather data update to get current temperatures
-- This will trigger the improved update-weather-data function

-- First, let's see what we have currently
-- SELECT city, temperature, description, created_at FROM weather_data;

-- Create a temporary function to trigger weather update via HTTP
SELECT net.http_post(
    url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := '{"force_update": true}'::jsonb
) as weather_update_request;