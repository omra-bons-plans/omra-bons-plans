-- Script de correction des extensions d'images dans la base de données
-- Les fichiers sont stockés en .webp/.jpeg mais la BDD a .png

-- Fonction pour corriger les chemins d'images
CREATE OR REPLACE FUNCTION fix_image_extensions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Corriger les cover_image dans ads (remplacer .png par .webp en priorité)
  UPDATE ads
  SET cover_image = REGEXP_REPLACE(cover_image, '\.png$', '.webp', 'i')
  WHERE cover_image LIKE '%.png'
  AND cover_image NOT LIKE 'http%';
  
  -- Corriger les images dans le tableau images
  UPDATE ads
  SET images = (
    SELECT array_agg(
      CASE 
        WHEN img LIKE '%.png' AND img NOT LIKE 'http%' 
        THEN REGEXP_REPLACE(img, '\.png$', '.webp', 'i')
        ELSE img
      END
    )
    FROM unnest(images) AS img
  )
  WHERE EXISTS (
    SELECT 1 
    FROM unnest(images) AS img 
    WHERE img LIKE '%.png' AND img NOT LIKE 'http%'
  );
  
  RAISE NOTICE 'Migration terminée: extensions d images corrigées';
END;
$$;

-- Exécuter la fonction
SELECT fix_image_extensions();

-- Supprimer la fonction après utilisation
DROP FUNCTION fix_image_extensions();