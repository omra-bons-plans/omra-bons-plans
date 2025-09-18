-- Activer les extensions nécessaires pour les tâches cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Créer une tâche cron pour publier automatiquement les articles programmés
-- Cette tâche s'exécute toutes les heures à la minute 0
SELECT cron.schedule(
  'publish-scheduled-blog-posts',
  '0 * * * *', -- Chaque heure à la minute 0
  $$
  SELECT
    net.http_post(
        url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/publish-scheduled-posts',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
        body := '{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);