-- Create a trigger to automatically update weather data
-- Add a function to periodically call the weather update
CREATE OR REPLACE FUNCTION public.trigger_weather_update()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be used to trigger weather updates
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/update-weather-data',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('trigger', 'auto_update')
  );
END;
$$;

-- Create a manual trigger for immediate update
INSERT INTO cron.job (jobname, schedule, command)
VALUES ('weather-update-hourly', '0 * * * *', 'SELECT public.trigger_weather_update();')
ON CONFLICT (jobname) DO UPDATE SET
  schedule = EXCLUDED.schedule,
  command = EXCLUDED.command;