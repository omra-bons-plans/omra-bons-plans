-- Créer une annonce expirée pour tester l'affichage avec les bonnes valeurs
INSERT INTO public.ads (
  title,
  description,
  price,
  original_price,
  category,
  location,
  cover_image,
  images,
  is_published,
  is_draft,
  is_paused,
  is_promotion,
  promotion_end_date,
  publish_end_date,
  show_email,
  show_phone,
  user_id,
  created_at,
  updated_at
) VALUES (
  'Offre Expirée - Séjour Omra Premium',
  'Un séjour omra premium avec hébergement 5 étoiles à La Mecque et Médine. Cette offre a expiré mais reste visible pour démonstration.',
  2500,
  3000,
  'sejours',
  'La Mecque, Arabie Saoudite',
  '/assets/mecca-mosque-hero.jpg',
  ARRAY['/assets/mecca-mosque-hero.jpg', '/assets/luxury-hotel-mecca.jpg'],
  true,
  false,
  false,
  true,
  (NOW() - INTERVAL '2 days')::timestamptz,
  (NOW() - INTERVAL '2 days')::timestamptz,
  true,
  true,
  (SELECT id FROM auth.users LIMIT 1),
  (NOW() - INTERVAL '10 days')::timestamptz,
  (NOW() - INTERVAL '2 days')::timestamptz
);

-- Ajouter les détails du séjour avec des valeurs valides
INSERT INTO public.ads_sejours (
  ad_id,
  formula_type,
  departure_date,
  return_date,
  nights_mecca,
  nights_medina,
  mecca_hotel_name,
  medina_hotel_name
) 
SELECT 
  id,
  'standard',
  (NOW() - INTERVAL '1 days')::date,
  (NOW() + INTERVAL '14 days')::date,
  7,
  7,
  'Hôtel Dar Al Iman Grand 5*',
  'Hôtel Al Madinah Harmony 5*'
FROM public.ads 
WHERE title = 'Offre Expirée - Séjour Omra Premium'
LIMIT 1;