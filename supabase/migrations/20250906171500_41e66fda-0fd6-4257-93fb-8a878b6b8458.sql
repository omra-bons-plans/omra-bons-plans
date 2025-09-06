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