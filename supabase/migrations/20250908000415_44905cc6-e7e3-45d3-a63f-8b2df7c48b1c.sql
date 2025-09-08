-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Temporary function to update exchange rate to correct value
DO $$
BEGIN
  -- Update the exchange rate to the correct value (4.39)
  UPDATE public.exchange_rates 
  SET rate = 4.39, 
      last_updated = now()
  WHERE base_currency = 'EUR' 
    AND target_currency = 'SAR';
    
  -- Log the update
  RAISE NOTICE 'Exchange rate updated to 4.39 EUR/SAR';
END $$;