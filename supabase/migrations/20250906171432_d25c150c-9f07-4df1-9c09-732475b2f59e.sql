-- Create function to increment profile views atomically
CREATE OR REPLACE FUNCTION increment_profile_views(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.profiles 
  SET profile_views = profile_views + 1
  WHERE id = profile_id
  RETURNING profile_views INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the notification cleanup to run daily
SELECT cron.schedule(
  'notification-cleanup-daily',
  '0 2 * * *', -- Run at 2 AM every day
  $$
  SELECT
    net.http_post(
        url:='https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/notification-cleanup',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHloZW5yeXpoenRkd3BrdnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTEwOTgsImV4cCI6MjA3MjU4NzA5OH0.JYopgd-0xzHifJBQzsUwIDjowEBbbS5bj_PyggQrHD4"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);