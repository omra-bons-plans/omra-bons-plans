-- Add draft status support to ads table
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT false;

-- Create index for better performance on draft queries
CREATE INDEX IF NOT EXISTS idx_ads_user_draft ON public.ads(user_id, is_draft);

-- Update RLS policies to include draft access
DROP POLICY IF EXISTS "Users can view their own ads" ON public.ads;

CREATE POLICY "Users can view their own ads" 
ON public.ads 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update the public viewing policy to exclude drafts
DROP POLICY IF EXISTS "Anyone can view published ads" ON public.ads;

CREATE POLICY "Anyone can view published ads" 
ON public.ads 
FOR SELECT 
USING ((is_published = true) AND (publish_end_date > now()) AND (is_draft = false));