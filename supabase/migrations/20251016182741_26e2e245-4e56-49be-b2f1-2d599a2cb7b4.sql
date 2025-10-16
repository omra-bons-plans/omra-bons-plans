-- Mettre à jour l'URL du scraper Tawaf pour pointer vers la page des offres
UPDATE omra_scraper_config
SET 
  agency_url = 'https://www.tawaf.fr/omra-pas-cher',
  updated_at = NOW()
WHERE agency_name = 'Tawaf';

-- Vérifier la mise à jour
SELECT agency_name, agency_url, is_active 
FROM omra_scraper_config 
WHERE agency_name = 'Tawaf';