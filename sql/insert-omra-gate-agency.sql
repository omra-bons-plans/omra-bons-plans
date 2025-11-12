-- Script pour ajouter l'agence OMRA GATE
-- À exécuter via l'éditeur SQL de Supabase

INSERT INTO public.agencies (name, url, google_rating, review_count, strengths, weaknesses, specialties, price_range, highlight) 
VALUES (
  'OMRA GATE',
  'https://www.omragate.com/',
  4.9,
  96,
  ARRAY['Excellente note Google de 4.9/5', 'Service personnalisé et accompagnement attentif', 'Organisation soignée et professionnelle', 'Bonne réactivité du service client'],
  ARRAY['Base d''avis plus limitée que grandes agences établies', 'Moins de visibilité sur le marché'],
  ARRAY['Omra organisée', 'Accompagnement personnalisé', 'Service de qualité'],
  'Standard',
  'Service personnalisé avec excellente note 4.9/5'
) 
ON CONFLICT (name) DO UPDATE SET
  google_rating = EXCLUDED.google_rating,
  review_count = EXCLUDED.review_count,
  updated_at = NOW();
