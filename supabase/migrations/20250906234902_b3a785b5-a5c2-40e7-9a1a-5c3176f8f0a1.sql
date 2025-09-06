-- Enable realtime for the ads table
ALTER TABLE public.ads REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ads;