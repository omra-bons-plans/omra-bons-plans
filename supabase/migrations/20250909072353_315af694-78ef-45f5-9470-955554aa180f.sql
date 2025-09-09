-- Mise à jour manuelle directe du taux de change avec le taux marché actuel
UPDATE exchange_rates 
SET 
  rate = 4.16,
  last_updated = NOW()
WHERE base_currency = 'EUR' AND target_currency = 'SAR';

-- Vérifier que la mise à jour a fonctionné
SELECT * FROM exchange_rates WHERE base_currency = 'EUR' AND target_currency = 'SAR';