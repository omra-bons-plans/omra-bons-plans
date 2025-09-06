-- Add new contact display columns to ads table
ALTER TABLE public.ads 
ADD COLUMN show_whatsapp boolean DEFAULT false,
ADD COLUMN show_professional_phone boolean DEFAULT false;