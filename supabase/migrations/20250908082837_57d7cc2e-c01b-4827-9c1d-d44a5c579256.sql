-- Déclencher manuellement une mise à jour immédiate des données météo
INSERT INTO net.http_request_queue (method, url, headers, body, timeout_milliseconds)
VALUES (
  'POST',
  'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
  '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
  '{"manual_trigger": true}'::bytea,
  5000
);

-- Déclencher manuellement une mise à jour des taux de change
INSERT INTO net.http_request_queue (method, url, headers, body, timeout_milliseconds)
VALUES (
  'POST', 
  'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-exchange-rates',
  '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
  '{"manual_trigger": true}'::bytea,
  5000
);