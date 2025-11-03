-- Corriger la date de début incorrecte pour l'offre Omra Pour Tous
-- qui part le 23/01/2025 au lieu du 23/12/2025
UPDATE omra_offers
SET date_start = '2025-12-23'::date
WHERE date_start = '2025-01-23'::date 
AND date_end = '2026-01-01'::date
AND agency_name = 'Omra Pour Tous'
AND offer_title = 'Omra essentiel - Décembre';