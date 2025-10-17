-- Table pour suivre les mises à jour hebdomadaires
CREATE TABLE IF NOT EXISTS public.omra_update_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled' ou 'manual'
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'success', 'error'
  offers_fetched INTEGER DEFAULT 0,
  offers_validated INTEGER DEFAULT 0,
  offers_rejected INTEGER DEFAULT 0,
  swap_executed BOOLEAN DEFAULT false,
  error_message TEXT,
  agency_results JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_omra_update_runs_started_at ON public.omra_update_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_omra_update_runs_status ON public.omra_update_runs(status);

-- Table temporaire pour le swap atomique (structure identique à omra_offers)
CREATE TABLE IF NOT EXISTS public.omra_offers_next (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL,
  agency_url TEXT NOT NULL,
  offer_title TEXT NOT NULL,
  offer_url TEXT NOT NULL,
  price_eur NUMERIC NOT NULL,
  currency_raw TEXT,
  month_departure TEXT NOT NULL,
  date_start DATE,
  date_end DATE,
  departure_city TEXT NOT NULL,
  formula_type TEXT NOT NULL,
  duration_nights INTEGER,
  makkah_nights INTEGER DEFAULT 0,
  medina_nights INTEGER DEFAULT 0,
  hotel_makkah TEXT,
  hotel_medinah TEXT,
  distance_to_haram_m INTEGER,
  board TEXT,
  flights_included BOOLEAN NOT NULL DEFAULT false,
  visa_included BOOLEAN DEFAULT false,
  guide_language TEXT[] DEFAULT ARRAY['fr']::TEXT[],
  notes TEXT,
  source_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error_message TEXT,
  UNIQUE(source_hash)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_omra_offers_next_source_hash ON public.omra_offers_next(source_hash);
CREATE INDEX IF NOT EXISTS idx_omra_offers_next_agency ON public.omra_offers_next(agency_name);
CREATE INDEX IF NOT EXISTS idx_omra_offers_next_scraped_at ON public.omra_offers_next(scraped_at DESC);

-- RLS pour omra_update_runs
ALTER TABLE public.omra_update_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage update runs"
ON public.omra_update_runs
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view successful runs"
ON public.omra_update_runs
FOR SELECT
USING (status = 'success');

-- RLS pour omra_offers_next
ALTER TABLE public.omra_offers_next ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage next offers"
ON public.omra_offers_next
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Fonction pour obtenir la dernière mise à jour réussie
CREATE OR REPLACE FUNCTION public.get_last_successful_update()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_run RECORD;
BEGIN
  SELECT 
    completed_at,
    offers_validated,
    offers_rejected,
    agency_results
  INTO v_last_run
  FROM public.omra_update_runs
  WHERE status = 'success' AND swap_executed = true
  ORDER BY completed_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'last_update', NULL,
      'offers_count', 0,
      'message', 'Aucune mise à jour effectuée'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'last_update', v_last_run.completed_at,
    'offers_count', v_last_run.offers_validated,
    'offers_rejected', v_last_run.offers_rejected,
    'agencies', v_last_run.agency_results
  );
END;
$$;

-- Fonction pour calculer le prochain run (jeudi 06:00 Europe/Paris)
CREATE OR REPLACE FUNCTION public.get_next_scheduled_update()
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_now TIMESTAMPTZ;
  v_next_thursday TIMESTAMPTZ;
  v_target_time TIME := '06:00:00';
  v_days_until_thursday INT;
BEGIN
  -- Obtenir l'heure actuelle en Europe/Paris
  v_now := NOW() AT TIME ZONE 'Europe/Paris';
  
  -- Calculer les jours jusqu'au prochain jeudi (4 = jeudi)
  v_days_until_thursday := (4 - EXTRACT(DOW FROM v_now)::INT + 7) % 7;
  
  -- Si c'est jeudi mais après 06:00, passer au jeudi suivant
  IF v_days_until_thursday = 0 AND v_now::TIME > v_target_time THEN
    v_days_until_thursday := 7;
  END IF;
  
  -- Si c'est aujourd'hui avant 06:00, utiliser aujourd'hui
  IF v_days_until_thursday = 0 THEN
    v_next_thursday := DATE(v_now) + v_target_time;
  ELSE
    v_next_thursday := (DATE(v_now) + v_days_until_thursday) + v_target_time;
  END IF;
  
  -- Convertir en UTC pour le stockage
  RETURN v_next_thursday AT TIME ZONE 'Europe/Paris';
END;
$$;