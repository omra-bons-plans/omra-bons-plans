-- Create storage bucket for ad images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-images', 
  'ad-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for ad images bucket
CREATE POLICY "Anyone can view ad images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ad-images');

CREATE POLICY "Authenticated users can upload ad images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'ad-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own ad images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'ad-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own ad images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'ad-images' AND 
  auth.role() = 'authenticated'
);