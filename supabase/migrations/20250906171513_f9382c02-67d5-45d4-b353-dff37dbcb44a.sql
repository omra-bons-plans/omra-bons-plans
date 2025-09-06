-- Fix the function security warning by adding search_path
DROP FUNCTION IF EXISTS increment_profile_views(UUID);

CREATE OR REPLACE FUNCTION public.increment_profile_views(profile_id UUID)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;