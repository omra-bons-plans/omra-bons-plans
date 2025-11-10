-- Mise à jour manuelle des nombres d'avis avec les valeurs exactes
UPDATE agencies 
SET 
  review_count = CASE name
    WHEN 'TAWAF' THEN 1343
    WHEN 'Medin Voyages' THEN 271
    WHEN 'Al Bayt' THEN 959
    WHEN 'Pèlerin Hajj' THEN 1354
    WHEN 'Omra Pour Tous' THEN 5778
    WHEN 'Al Maqam Voyages' THEN 392
    WHEN 'Omra Sounnah' THEN 309
    WHEN 'Al Sirate Voyage' THEN 1114
  END,
  last_review_update = NOW()
WHERE name IN ('TAWAF', 'Medin Voyages', 'Al Bayt', 'Pèlerin Hajj', 'Omra Pour Tous', 'Al Maqam Voyages', 'Omra Sounnah', 'Al Sirate Voyage');