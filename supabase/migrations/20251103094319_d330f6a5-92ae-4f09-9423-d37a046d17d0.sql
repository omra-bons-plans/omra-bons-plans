-- Corriger les dates mal formatées dans omra_offers
-- Remplacer '0026-' par '2026-' et '0226-' par '2026-'

UPDATE omra_offers
SET date_start = ('2026' || substring(date_start::text from 5))::date
WHERE date_start::text LIKE '0026-%' OR date_start::text LIKE '0226-%';

UPDATE omra_offers
SET date_end = ('2026' || substring(date_end::text from 5))::date
WHERE date_end::text LIKE '0026-%' OR date_end::text LIKE '0226-%';