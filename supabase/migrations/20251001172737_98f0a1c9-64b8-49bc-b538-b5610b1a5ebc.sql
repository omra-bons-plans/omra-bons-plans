-- Restaurer les extensions d'images originales dans la table ads
-- Les fichiers .webp n'existent pas physiquement, donc on restaure les extensions d'origine

-- Pour cover_image: remplacer .webp par l'extension d'origine
UPDATE ads 
SET cover_image = regexp_replace(cover_image, '\.webp$', '.png', 'i')
WHERE cover_image LIKE '%cover.webp';

UPDATE ads 
SET cover_image = regexp_replace(cover_image, '\.webp$', '.jpg', 'i')
WHERE cover_image LIKE '%.webp' AND cover_image NOT LIKE '%cover.webp';

UPDATE ads 
SET cover_image = regexp_replace(cover_image, '\.webp$', '.jpeg', 'i')
WHERE cover_image LIKE '%.webp';

-- Pour les images supplémentaires (array text[])
-- On parcourt chaque élément et remplace .webp
UPDATE ads 
SET images = ARRAY(
  SELECT regexp_replace(unnest(images), '\.webp$', '.jpg', 'i')
)
WHERE array_to_string(images, ',') LIKE '%.webp%';

-- Pour les articles de blog
UPDATE blog_posts 
SET cover_image = regexp_replace(cover_image, '\.webp$', '.png', 'i')
WHERE cover_image LIKE '%cover.webp';

UPDATE blog_posts 
SET cover_image = regexp_replace(cover_image, '\.webp$', '.jpg', 'i')
WHERE cover_image LIKE '%.webp' AND cover_image NOT LIKE '%cover.webp';

UPDATE blog_posts 
SET images = ARRAY(
  SELECT regexp_replace(unnest(images), '\.webp$', '.jpg', 'i')
)
WHERE array_to_string(images, ',') LIKE '%.webp%';