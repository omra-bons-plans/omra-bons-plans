-- Configuration du cron job pour actualiser la météo toutes les heures
-- Supprime l'ancien job s'il existe
SELECT cron.unschedule('update-weather-data-hourly');

-- Crée un nouveau job qui s'exécute toutes les heures à la minute 0
SELECT cron.schedule(
  'update-weather-data-hourly',
  '0 * * * *', -- Toutes les heures à :00
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMTA5OCwiZXhwIjoyMDcyNTg3MDk4fQ.p7vFAnvkVkFITWc66rvFOwAjGh3owDbT6f7I1g4NLEA"}'::jsonb,
        body:='{"scheduled": true, "trigger": "hourly_cron"}'::jsonb
    ) as request_id;
  $$
);

-- Vérification que le job a été créé
SELECT jobname, schedule, active, created FROM cron.job WHERE jobname = 'update-weather-data-hourly';