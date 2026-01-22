-- Ajouter l'agence Haramain Voyages au comparatif d'agences
INSERT INTO public.agencies (
  name,
  url,
  google_rating,
  review_count,
  highlight,
  price_range,
  specialties,
  strengths,
  weaknesses,
  google_search_url
) VALUES (
  'Haramain Voyages',
  'https://www.haramainvoyages.com/',
  4.8,
  0, -- À mettre à jour avec le nombre réel d'avis
  'Spécialiste Hajj & Omra à Saint-Denis',
  '€€€',
  ARRAY['Hajj', 'Omra', 'Groupes'],
  ARRAY['Excellente note Google (4.8)', 'Accompagnement personnalisé', 'Groupes WhatsApp/Telegram dédiés', 'Webinaires de préparation'],
  ARRAY['Agence récente'],
  'https://www.google.com/maps/place/Haramain+Voyages'
)
ON CONFLICT (name) DO UPDATE SET
  google_rating = EXCLUDED.google_rating,
  url = EXCLUDED.url,
  highlight = EXCLUDED.highlight,
  specialties = EXCLUDED.specialties,
  strengths = EXCLUDED.strengths,
  google_search_url = EXCLUDED.google_search_url,
  updated_at = now();