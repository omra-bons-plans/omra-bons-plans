-- Force an immediate weather update by calling the edge function
SELECT net.http_post(
  url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/update-weather-data',
  headers := jsonb_build_object(
    'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4',
    'Content-Type', 'application/json'
  ),
  body := jsonb_build_object('trigger', 'manual_refresh')
) AS request_id;