-- Créer une tâche cron pour supprimer automatiquement les annonces expirées
-- Cette tâche s'exécute tous les jours à 2h du matin

-- Activer l'extension pg_cron si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programmer la tâche de nettoyage automatique
SELECT cron.schedule(
  'cleanup-expired-ads-daily',
  '0 2 * * *', -- Tous les jours à 2h du matin
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/cleanup-expired-ads',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);