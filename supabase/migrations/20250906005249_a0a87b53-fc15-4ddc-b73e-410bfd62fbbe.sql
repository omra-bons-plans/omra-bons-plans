-- Add country code columns for phone numbers
ALTER TABLE public.profiles 
ADD COLUMN phone_country text DEFAULT '+33',
ADD COLUMN whatsapp_country text DEFAULT '+33',
ADD COLUMN professional_phone_country text DEFAULT '+33';