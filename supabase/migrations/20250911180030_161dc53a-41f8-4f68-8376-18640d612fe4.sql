-- Configure Supabase to use custom email functions
-- We need to set up auth hooks properly

-- Create a function to handle auth events
CREATE OR REPLACE FUNCTION public.handle_auth_email_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hook_url text;
BEGIN
  -- Construct the hook URL for our edge function
  hook_url := 'https://lptyhenryzhztdwpkvsc.supabase.co/functions/v1/send-confirmation-email';
  
  -- For signup events, call our custom email function
  IF TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NULL THEN
    -- This will be handled by Supabase's built-in email system
    -- We need to configure auth.email settings instead
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$;