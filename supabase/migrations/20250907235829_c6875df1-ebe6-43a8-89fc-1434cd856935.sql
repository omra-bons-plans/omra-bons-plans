-- Create a table to store exchange rates
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'EUR',
  target_currency TEXT NOT NULL DEFAULT 'SAR',
  rate DECIMAL(10,4) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (but make it publicly readable since it's reference data)
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for exchange rates
CREATE POLICY "Exchange rates are viewable by everyone" 
ON public.exchange_rates 
FOR SELECT 
USING (true);

-- Insert initial data
INSERT INTO public.exchange_rates (base_currency, target_currency, rate, last_updated)
VALUES ('EUR', 'SAR', 3.95, now());