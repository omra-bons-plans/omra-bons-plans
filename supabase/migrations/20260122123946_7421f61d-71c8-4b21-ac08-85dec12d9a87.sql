-- Create hajj_offers table with specific fields for Hajj packages
CREATE TABLE public.hajj_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Agency information
  agency_name TEXT NOT NULL,
  agency_url TEXT NOT NULL,
  offer_url TEXT NOT NULL,
  
  -- Dates & duration
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  duration_nights INTEGER,
  
  -- Price
  price_quad_eur NUMERIC NOT NULL,
  
  -- Package type (Standard, Premium, Premium Shifting, Luxury, Luxury Shifting)
  package_type TEXT NOT NULL DEFAULT 'standard',
  
  -- Accommodation
  hotel_makkah TEXT NOT NULL,
  hotel_medina TEXT NOT NULL,
  
  -- Mina camp
  camp_mina TEXT,
  
  -- Board
  half_board BOOLEAN NOT NULL DEFAULT false,
  
  -- Departure cities (multi-select stored as array)
  departure_cities TEXT[] NOT NULL DEFAULT '{}',
  
  -- Zone (A, M, C)
  accommodation_zone TEXT NOT NULL DEFAULT 'A',
  
  -- Airline
  airline TEXT NOT NULL,
  
  -- Recommendation
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hajj_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for hajj_offers
CREATE POLICY "Anyone can view active hajj offers" 
ON public.hajj_offers 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can manage all hajj offers" 
ON public.hajj_offers 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hajj_offers_updated_at
BEFORE UPDATE ON public.hajj_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.hajj_offers IS 'Stores Hajj pilgrimage package offers from various agencies';