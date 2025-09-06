-- Vérification des politiques storage pour s'assurer que les images sont bien accessibles publiquement
-- Politique pour lecture publique des images d'annonces (déjà existante mais on s'assure qu'elle fonctionne)
DROP POLICY IF EXISTS "Anyone can view ad images" ON storage.objects;

CREATE POLICY "Public can view ad images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ad-images');

-- S'assurer que le bucket est bien configuré comme public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'ad-images';