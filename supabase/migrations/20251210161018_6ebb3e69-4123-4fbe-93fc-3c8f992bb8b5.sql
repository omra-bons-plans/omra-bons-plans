-- Supprimer les offres de l'agence Al Bayt
DELETE FROM omra_offers WHERE agency_name ILIKE '%al bayt%' OR agency_name ILIKE '%albayt%';

-- Supprimer de la table omra_offers_next aussi
DELETE FROM omra_offers_next WHERE agency_name ILIKE '%al bayt%' OR agency_name ILIKE '%albayt%';

-- Supprimer de la config du scraper si présent
DELETE FROM omra_scraper_config WHERE agency_name ILIKE '%al bayt%' OR agency_name ILIKE '%albayt%';

-- Supprimer de la table agencies si présent
DELETE FROM agencies WHERE name ILIKE '%al bayt%' OR name ILIKE '%albayt%';