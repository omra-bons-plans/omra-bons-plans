-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create a cron job that calls publish-scheduled-posts every 10 minutes
SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/publish-scheduled-posts',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);