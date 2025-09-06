-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS kuniya text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS facebook text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS is_professional boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS professional_phone text;

-- Add gender constraint if not exists
DO $$ 
BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_gender_check CHECK (gender IN ('male', 'female'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;