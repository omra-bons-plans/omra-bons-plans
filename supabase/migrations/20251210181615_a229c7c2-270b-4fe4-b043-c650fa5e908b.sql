-- Publier l'article qui aurait dû l'être le 8 décembre
UPDATE blog_posts 
SET is_published = true, 
    published_at = NOW(), 
    scheduled_publish_at = NULL 
WHERE id = '4ff4de34-fcea-49ad-b343-17ac1c00d7a9';

-- Supprimer l'ancien cron job défaillant
SELECT cron.unschedule(13);

-- Recréer le cron job avec la clé anon directe
SELECT cron.schedule(
  'publish-scheduled-posts',
  '0 * * * *', -- toutes les heures
  $$
  SELECT net.http_post(
    url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/publish-scheduled-posts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);