-- Force update des taux de change pour corriger le problème
-- Supprimer l'ancien job cron défaillant
SELECT cron.unschedule('update-exchange-rates-12h');

-- Recréer le job cron avec une fréquence plus élevée (toutes les 6h au lieu de 12h)
SELECT cron.schedule(
  'update-exchange-rates-6h',
  '0 */6 * * *', -- Toutes les 6 heures au lieu de 12h
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-exchange-rates',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Force une mise à jour immédiate pour corriger le taux obsolète
SELECT
  net.http_post(
      url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-exchange-rates',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE7NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
      body:='{"immediate_update": true}'::jsonb
  ) as request_id;