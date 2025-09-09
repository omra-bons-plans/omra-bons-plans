-- Mise à jour manuelle des données météo avec les températures correctes
-- Médine: 38°C, Makkah: 37°C comme indiqué par l'utilisateur

UPDATE weather_data 
SET 
    temperature = 38,
    description = 'Clear',
    humidity = 25,
    wind_speed = 6.0,
    created_at = now(),
    last_updated = now()
WHERE city = 'madinah';

UPDATE weather_data 
SET 
    temperature = 37,
    description = 'Clear', 
    humidity = 30,
    wind_speed = 5.0,
    created_at = now(),
    last_updated = now()
WHERE city = 'makkah';

-- Vérification des données mises à jour
SELECT city, temperature, description, created_at FROM weather_data ORDER BY created_at DESC;