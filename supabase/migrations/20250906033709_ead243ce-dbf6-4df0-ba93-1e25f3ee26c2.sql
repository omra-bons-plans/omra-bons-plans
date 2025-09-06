-- Mettre à jour le champ location pour les annonces de baby-sitting
UPDATE ads 
SET location = ads_babysitting.city
FROM ads_babysitting 
WHERE ads.id = ads_babysitting.ad_id 
  AND ads.location = 'Lieux saints' 
  AND ads.category = 'babysitting';

-- Mettre à jour le champ location pour les annonces de guides
UPDATE ads 
SET location = CASE 
  WHEN ads_guides.city = 'both' THEN 'Makkah - Médine'
  WHEN ads_guides.city = 'makkah' THEN 'Makkah' 
  WHEN ads_guides.city = 'medina' THEN 'Médine'
  ELSE ads_guides.city 
END
FROM ads_guides 
WHERE ads.id = ads_guides.ad_id 
  AND ads.location = 'Lieux saints' 
  AND ads.category = 'guides';

-- Mettre à jour le champ location pour les annonces de chauffeurs  
UPDATE ads 
SET location = CASE 
  WHEN ads_chauffeurs.city = 'makkah' THEN 'Makkah'
  WHEN ads_chauffeurs.city = 'medina' THEN 'Médine'
  WHEN ads_chauffeurs.city = 'jeddah' THEN 'Jeddah'
  ELSE ads_chauffeurs.city 
END
FROM ads_chauffeurs 
WHERE ads.id = ads_chauffeurs.ad_id 
  AND ads.location = 'Lieux saints' 
  AND ads.category = 'chauffeurs';