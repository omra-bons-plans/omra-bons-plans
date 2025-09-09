-- Supprime l'ancien job météo et crée le nouveau avec la fonction améliorée
SELECT cron.unschedule('update-weather-hourly');

-- Crée le job pour actualiser la météo toutes les heures
SELECT cron.schedule(
  'update-weather-hourly', 
  '0 * * * *', -- Toutes les heures à la minute 0
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{"scheduled": true, "trigger": "hourly_cron"}'::jsonb
    ) as request_id;
  $$
);

-- Vérification
SELECT jobname, schedule, active FROM cron.job WHERE jobname = 'update-weather-hourly';