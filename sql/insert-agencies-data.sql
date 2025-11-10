-- Script pour insérer les données des agences
-- À exécuter une seule fois via l'éditeur SQL de Supabase

INSERT INTO public.agencies (name, url, google_search_url, google_rating, review_count, strengths, weaknesses, specialties, price_range, highlight) VALUES
('TAWAF', 'https://www.tawaf.fr/', 'https://www.google.com/search?q=tawaf.fr', 4.9, 1289, 
 ARRAY['Guides très bienveillants', 'Organisation impeccable', 'Hôtels de bon standing', 'Expérience spirituelle forte'], 
 ARRAY['Quelques déceptions sur attitude guide', 'Moments de stress logistique'], 
 ARRAY['Omra premium', 'Hajj VIP', 'Séjours spirituels'], 
 'Premium', 'Excellence dans l''accompagnement spirituel et l''organisation'),

('Al Bayt', 'https://www.albayt.fr/', 'https://www.google.com/search?q=albayt.fr', 4.7, 959, 
 ARRAY['Bonne réputation (13 ans)', 'Offres variées', 'Accompagnement complet', 'Identité spirituelle rassurante'], 
 ARRAY['Manque de détails clairs', 'Navigation peu comparative', 'Contenu limité'], 
 ARRAY['Hajj & Omra traditionnel', 'Réservation en ligne', 'Offres variées'], 
 'Standard', 'Agence pionnière avec 13 ans d''expérience et 98% de satisfaction'),

('Pèlerin Hajj', 'https://pelerinhajj.com/', 'https://www.google.com/search?q=pelerinhajj.fr', 4.9, 1200, 
 ARRAY['Note élevée avec plus de 1200 avis', 'Présence active sur réseaux', 'Tarifs clairs dès 999€', 'Ancienneté depuis 2018'], 
 ARRAY['Peu de détails sur problèmes', 'Manque d''information post-paiement'], 
 ARRAY['Omra accessible', 'Hajj traditionnel', 'Voyages spirituels'], 
 'Économique', 'Forte présence digitale avec tarifs accessibles dès 999€'),

('Omra Pour Tous', 'https://omrapourtous.com/', 'https://www.google.com/search?q=omrapourtous+avis', 4.9, 4822, 
 ARRAY['Prix attractifs et clairs', 'Départs multi-villes', 'Hôtels 4★/5★', 'Agence agréée'], 
 ARRAY['Hausse des prix périodes scolaires', 'Peu de détails précis', 'Navigation peu optimisée'], 
 ARRAY['Omra économique', 'Séjours courts', 'Départs régionaux'], 
 'Économique', 'Leader avec plus de 4800 avis et départs multi-villes'),

('Al Maqam Voyages', 'https://almaqamvoyages.com/', 'https://www.google.com/search?q=al+maqam+voyages', 4.9, 349, 
 ARRAY['Bonne expérience (8+ ans)', 'Offres variées', 'Formules tout inclus', 'Témoignages positifs'], 
 ARRAY['Prix élevés selon périodes', 'Départs surtout depuis Paris', 'Peu d''infos sur extras'], 
 ARRAY['Omra confort', 'Hajj premium', 'Circuits spirituels'], 
 'Standard', '8+ ans d''expérience avec formules tout inclus'),

('Al Sirate Voyage', 'https://www.alsiratevoyage.com/', 'https://www.google.com/search?q=al+sirat+voyages', 5.0, 1015, 
 ARRAY['Organisation excellente', 'Guides compétents', 'Hôtels bien situés', 'Bon service client'], 
 ARRAY['Peu d''avis négatifs visibles', 'Prix parfois élevés', 'Places limitées'], 
 ARRAY['Omra premium', 'Hajj VIP', 'Voyages de groupe'], 
 'Premium', 'Note parfaite 5/5 avec organisation d''excellence'),

('Omra Sounnah', 'https://www.omrasounnah.com/', 'https://www.google.com/search?q=omra+sounnah', 4.9, 303, 
 ARRAY['Excellente organisation', 'Guides compétents', 'Hôtels de qualité', 'Bonne réactivité'], 
 ARRAY['Places limitées', 'Prix variables', 'Départs depuis Paris'], 
 ARRAY['Omra traditionnelle', 'Voyages spirituels', 'Accompagnement personnalisé'], 
 'Standard', 'Note excellente de 4.9/5 avec accompagnement personnalisé'),

('Omra Discount', 'https://www.omradiscount.fr/', 'https://www.google.com/search?q=omra+discount', 4.9, 120, 
 ARRAY['Prix discount très attractifs', 'Excellent rapport qualité/prix', 'Organisation complète', 'Hôtels près du Haram'], 
 ARRAY['Moins d''avis que grandes agences', 'Historique plus récent', 'Peu de témoignages détaillés'], 
 ARRAY['Formules 5★ discount', 'Omra économique', 'Départs multi-villes'], 
 'Économique', 'Spécialiste des prix discount sur formules 5★'),

('Medin Voyages', 'https://medinvoyages.com/', 'https://www.google.com/search?q=medin+voyage', 5.0, 269, 
 ARRAY['Note parfaite 5/5', 'Agence spécialisée', 'Forte présence réseaux sociaux', 'Équipe dédiée'], 
 ARRAY['Moins connue que grandes agences', 'Informations détaillées limitées'], 
 ARRAY['Omra guidée', 'Hajj', 'Voyages spirituels'], 
 'Standard', 'Note parfaite 5/5 avec 269 avis')

ON CONFLICT (name) DO UPDATE SET
  google_rating = EXCLUDED.google_rating,
  review_count = EXCLUDED.review_count,
  updated_at = NOW();
