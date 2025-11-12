-- Corriger les chemins d'images pour l'annonce TRANSPORT MAKKAH
-- Remplacer .jpg par .webp pour les chemins existants

UPDATE ads 
SET 
  images = ARRAY[
    'chauffeur/e22bcba2-ca7c-4573-bb4c-efe69f69b778/1759086131143-0.webp',
    'chauffeur/e22bcba2-ca7c-4573-bb4c-efe69f69b778/1759086133353-1.webp'
  ],
  cover_image = 'chauffeur/e22bcba2-ca7c-4573-bb4c-efe69f69b778/1759086130222-cover.webp'
WHERE id = '321909a0-3cff-4b70-a7c2-ae7a68287c42';

-- Corriger tous les autres chemins .jpg en .webp dans la table ads
UPDATE ads
SET images = ARRAY(
  SELECT REPLACE(unnest(images), '.jpg', '.webp')
)
WHERE EXISTS (
  SELECT 1 FROM unnest(images) AS img WHERE img LIKE '%.jpg'
);

UPDATE ads
SET cover_image = REPLACE(cover_image, '.jpg', '.webp')
WHERE cover_image LIKE '%.jpg';