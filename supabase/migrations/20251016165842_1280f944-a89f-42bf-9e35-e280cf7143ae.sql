-- Fonction pour récupérer les offres Omra avec filtres
CREATE OR REPLACE FUNCTION public.get_omra_offers(
  filter_month TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  filter_formula TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT 0,
  max_price NUMERIC DEFAULT 999999,
  min_duration INTEGER DEFAULT 0,
  max_distance INTEGER DEFAULT 999999
)
RETURNS TABLE (
  id UUID,
  agency_name TEXT,
  agency_url TEXT,
  price_eur NUMERIC,
  month_departure TEXT,
  date_start DATE,
  date_end DATE,
  departure_city TEXT,
  formula_type TEXT,
  duration_nights INTEGER,
  makkah_nights INTEGER,
  medina_nights INTEGER,
  hotel_makkah TEXT,
  hotel_medinah TEXT,
  distance_to_haram_m INTEGER,
  offer_url TEXT,
  board TEXT,
  flights_included BOOLEAN,
  visa_included BOOLEAN,
  offer_title TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.agency_name,
    o.agency_url,
    o.price_eur,
    o.month_departure,
    o.date_start,
    o.date_end,
    o.departure_city,
    o.formula_type,
    o.duration_nights,
    o.makkah_nights,
    o.medina_nights,
    o.hotel_makkah,
    o.hotel_medinah,
    o.distance_to_haram_m,
    o.offer_url,
    o.board,
    o.flights_included,
    o.visa_included,
    o.offer_title
  FROM public.omra_offers o
  WHERE o.status = 'active'
    AND (filter_month IS NULL OR o.month_departure = filter_month)
    AND (filter_city IS NULL OR o.departure_city = filter_city)
    AND (filter_formula IS NULL OR o.formula_type = filter_formula)
    AND o.price_eur >= min_price
    AND o.price_eur <= max_price
    AND (min_duration = 0 OR o.duration_nights >= min_duration)
    AND (max_distance = 999999 OR o.distance_to_haram_m <= max_distance);
END;
$$;