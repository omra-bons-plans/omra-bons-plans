-- Configure auth hooks to send custom confirmation emails
-- First, check if we need to configure the auth hook
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'send_custom_confirmation_email';