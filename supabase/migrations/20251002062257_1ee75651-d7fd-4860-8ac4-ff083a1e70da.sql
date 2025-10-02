-- Restaurer les extensions correctes des images blog (.jpg au lieu de .webp)
-- car les fichiers réels dans le bucket ont l'extension .jpg

UPDATE blog_posts
SET cover_image = REGEXP_REPLACE(cover_image, '\.webp$', '.jpg', 'i')
WHERE cover_image LIKE '%.webp'
AND cover_image LIKE '%blog-images%';

-- Corriger aussi les images dans le tableau images si nécessaire
UPDATE blog_posts
SET images = (
  SELECT array_agg(
    CASE
      WHEN img LIKE '%.webp' AND img LIKE '%blog-images%'
      THEN REGEXP_REPLACE(img, '\.webp$', '.jpg', 'i')
      ELSE img
    END
  )
  FROM unnest(images) AS img
)
WHERE EXISTS (
  SELECT 1
  FROM unnest(images) AS img
  WHERE img LIKE '%.webp' AND img LIKE '%blog-images%'
);