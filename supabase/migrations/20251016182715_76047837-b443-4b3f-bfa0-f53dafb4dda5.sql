-- Mise à jour de la configuration du scraper Tawaf avec les vrais sélecteurs
UPDATE omra_scraper_config
SET 
  selectors = jsonb_build_object(
    'offerContainer', 'a.elementor-button.elementor-button-link',
    'offerUrl', 'href',
    'offerTitle', '.elementor-button-text',
    'price', '.elementor-button-text b',
    'dates', '.elementor-button-text strong',
    'monthTitle', 'h2.elementor-heading-title a',
    'isComplete', '.omra-complet'
  ),
  updated_at = NOW()
WHERE agency_name = 'Tawaf';

-- Vérifier que la mise à jour a bien été effectuée
SELECT 
  agency_name,
  agency_url,
  is_active,
  selectors
FROM omra_scraper_config
WHERE agency_name = 'Tawaf';