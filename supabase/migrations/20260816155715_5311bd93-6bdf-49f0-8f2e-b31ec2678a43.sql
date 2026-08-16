DROP POLICY IF EXISTS "Authenticated users can upload ad images" ON storage.objects;

CREATE POLICY "Users can upload ad images in their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'ad-images'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR (auth.uid())::text = (storage.foldername(name))[2]
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "Users can update their own ad images" ON storage.objects;
CREATE POLICY "Users can update their own ad images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'ad-images'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR (auth.uid())::text = (storage.foldername(name))[2]
    OR public.is_admin()
  )
)
WITH CHECK (
  bucket_id = 'ad-images'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR (auth.uid())::text = (storage.foldername(name))[2]
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "Users can delete their own ad images" ON storage.objects;
CREATE POLICY "Users can delete their own ad images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'ad-images'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR (auth.uid())::text = (storage.foldername(name))[2]
    OR public.is_admin()
  )
);