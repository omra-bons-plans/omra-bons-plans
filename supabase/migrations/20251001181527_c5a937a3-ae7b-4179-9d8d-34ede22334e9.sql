-- Corriger les extensions des images blog de .jpg vers .webp
UPDATE blog_posts
SET cover_image = REGEXP_REPLACE(cover_image, '\.jpg$', '.webp', 'i')
WHERE cover_image LIKE '%.jpg'
AND cover_image LIKE '%blog-images%';

-- Corriger aussi les images dans le tableau images si nécessaire
UPDATE blog_posts
SET images = (
  SELECT array_agg(
    CASE
      WHEN img LIKE '%.jpg' AND img LIKE '%blog-images%'
      THEN REGEXP_REPLACE(img, '\.jpg$', '.webp', 'i')
      ELSE img
    END
  )
  FROM unnest(images) AS img
)
WHERE EXISTS (
  SELECT 1
  FROM unnest(images) AS img
  WHERE img LIKE '%.jpg' AND img LIKE '%blog-images%'
);