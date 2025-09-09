-- Correction du token et force update immédiate avec le bon Bearer token
SELECT
  net.http_post(
      url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-exchange-rates',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
      body:='{"force_update": true}'::jsonb
  ) as request_id;