-- Add is_paused column to ads table for managing paused/active status without expiration dates
ALTER TABLE public.ads ADD COLUMN is_paused boolean DEFAULT false;