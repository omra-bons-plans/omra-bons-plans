-- Test the updated weather function with fallback APIs
-- This will manually trigger the weather update to get fresh data

-- First let's see current data
SELECT 'Current weather data:' as info;
SELECT city, temperature, description, last_updated FROM weather_data ORDER BY city;

-- Now test the update function
-- We can't call the function directly here, but let's delete the old data to force a fresh fetch when the app calls it
DELETE FROM weather_data WHERE last_updated < (now() - interval '1 hour');

-- Insert a temporary trigger record to indicate manual update requested
INSERT INTO weather_data (city, temperature, description, icon, last_updated) 
VALUES ('test_update_trigger', 0, 'Manual update requested', '', now())
ON CONFLICT (city) DO UPDATE SET last_updated = now();