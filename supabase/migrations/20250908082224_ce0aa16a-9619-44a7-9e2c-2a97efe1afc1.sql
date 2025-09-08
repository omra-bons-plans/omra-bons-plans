-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule weather data updates every hour
SELECT cron.schedule(
  'update-weather-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Schedule exchange rate updates every 12 hours
SELECT cron.schedule(
  'update-exchange-rates-12h',
  '0 */12 * * *', -- Every 12 hours at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-exchange-rates',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);