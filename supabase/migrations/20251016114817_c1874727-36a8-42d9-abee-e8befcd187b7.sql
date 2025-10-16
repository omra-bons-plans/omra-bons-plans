-- Create omra_offers table
CREATE TABLE IF NOT EXISTS public.omra_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL,
  agency_url TEXT NOT NULL,
  offer_title TEXT NOT NULL,
  offer_url TEXT NOT NULL,
  price_eur NUMERIC NOT NULL,
  currency_raw TEXT,
  duration_nights INTEGER,
  month_departure TEXT NOT NULL, -- YYYY-MM format
  date_start DATE,
  date_end DATE,
  departure_city TEXT NOT NULL,
  formula_type TEXT NOT NULL CHECK (formula_type IN ('standard', 'confort', 'premium', 'elite', 'autre')),
  board TEXT CHECK (board IN ('bb', 'hb', 'fb', 'ai')),
  visa_included BOOLEAN DEFAULT false,
  flights_included BOOLEAN NOT NULL DEFAULT false,
  medina_nights INTEGER DEFAULT 0,
  makkah_nights INTEGER DEFAULT 0,
  hotel_medinah TEXT,
  hotel_makkah TEXT,
  distance_to_haram_m INTEGER,
  guide_language TEXT[] DEFAULT ARRAY['fr'],
  notes TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_hash TEXT NOT NULL UNIQUE, -- hash(agency_name + offer_url + date_start)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stale', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_omra_offers_status ON public.omra_offers(status);
CREATE INDEX idx_omra_offers_month ON public.omra_offers(month_departure);
CREATE INDEX idx_omra_offers_price ON public.omra_offers(price_eur);
CREATE INDEX idx_omra_offers_departure_city ON public.omra_offers(departure_city);
CREATE INDEX idx_omra_offers_formula_type ON public.omra_offers(formula_type);
CREATE INDEX idx_omra_offers_scraped_at ON public.omra_offers(scraped_at);
CREATE INDEX idx_omra_offers_source_hash ON public.omra_offers(source_hash);

-- Create scraper config table
CREATE TABLE IF NOT EXISTS public.omra_scraper_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL UNIQUE,
  agency_url TEXT NOT NULL,
  scraper_type TEXT NOT NULL DEFAULT 'html' CHECK (scraper_type IN ('html', 'api', 'csv')),
  selectors JSONB, -- CSS selectors for HTML scraping
  api_config JSONB, -- API configuration
  is_active BOOLEAN DEFAULT true,
  respect_robots BOOLEAN DEFAULT true,
  rate_limit_ms INTEGER DEFAULT 1000,
  last_scrape_at TIMESTAMP WITH TIME ZONE,
  last_scrape_status TEXT,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scraper logs table
CREATE TABLE IF NOT EXISTS public.omra_scraper_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL,
  run_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'error')),
  offers_scraped INTEGER DEFAULT 0,
  offers_added INTEGER DEFAULT 0,
  offers_updated INTEGER DEFAULT 0,
  offers_errors INTEGER DEFAULT 0,
  error_details JSONB,
  duration_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_scraper_logs_run_id ON public.omra_scraper_logs(run_id);
CREATE INDEX idx_scraper_logs_agency ON public.omra_scraper_logs(agency_name);

-- Enable RLS
ALTER TABLE public.omra_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omra_scraper_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omra_scraper_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for omra_offers
CREATE POLICY "Anyone can view active offers"
  ON public.omra_offers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage all offers"
  ON public.omra_offers FOR ALL
  USING (public.is_admin());

-- RLS Policies for scraper config
CREATE POLICY "Admins can manage scraper config"
  ON public.omra_scraper_config FOR ALL
  USING (public.is_admin());

-- RLS Policies for scraper logs
CREATE POLICY "Admins can view scraper logs"
  ON public.omra_scraper_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Service role can insert scraper logs"
  ON public.omra_scraper_logs FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_omra_offers_updated_at
  BEFORE UPDATE ON public.omra_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scraper_config_updated_at
  BEFORE UPDATE ON public.omra_scraper_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to mark stale offers
CREATE OR REPLACE FUNCTION public.mark_stale_omra_offers()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  UPDATE public.omra_offers
  SET status = 'stale'
  WHERE status = 'active'
    AND scraped_at < NOW() - INTERVAL '60 days';
  
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$;