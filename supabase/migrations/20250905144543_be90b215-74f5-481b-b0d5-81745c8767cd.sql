-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create storage bucket for ad images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true);

-- Create storage policies for ad images
CREATE POLICY "Anyone can view ad images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-images');

CREATE POLICY "Authenticated users can upload ad images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ad-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own ad images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ad-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ad images"
ON storage.objects FOR DELETE
USING (bucket_id = 'ad-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create ads table
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('sejours', 'vols', 'hebergement', 'guides', 'chauffeurs', 'babysitting')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'EUR',
  location TEXT,
  images TEXT[] DEFAULT '{}',
  cover_image TEXT,
  
  -- Contact information
  show_email BOOLEAN DEFAULT TRUE,
  show_phone BOOLEAN DEFAULT FALSE,
  
  -- Promotion settings
  is_promotion BOOLEAN DEFAULT FALSE,
  promotion_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Publication settings
  is_published BOOLEAN DEFAULT FALSE,
  publish_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (id)
);

-- Create specific tables for each category

-- Séjours table
CREATE TABLE public.ads_sejours (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  formula_type TEXT NOT NULL CHECK (formula_type IN ('confort', 'essentiel', 'eco')),
  airline TEXT,
  departure_date DATE,
  return_date DATE,
  nights_medina INTEGER,
  nights_mecca INTEGER,
  
  -- Hotel information
  medina_hotel_name TEXT,
  medina_hotel_distance TEXT,
  mecca_hotel_name TEXT,
  mecca_hotel_distance TEXT,
  
  PRIMARY KEY (ad_id)
);

-- Vols table
CREATE TABLE public.ads_vols (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  airline TEXT NOT NULL,
  departure_airport TEXT,
  arrival_airport TEXT,
  departure_date DATE,
  return_date DATE,
  has_stopover BOOLEAN DEFAULT FALSE,
  stopover_details TEXT,
  
  PRIMARY KEY (ad_id)
);

-- Hébergements table
CREATE TABLE public.ads_hebergements (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  accommodation_type TEXT NOT NULL CHECK (accommodation_type IN ('hotel', 'apartment')),
  city TEXT NOT NULL CHECK (city IN ('makkah', 'medina')),
  name TEXT NOT NULL,
  distance_to_mosque TEXT,
  available_from DATE,
  available_to DATE,
  beds_count INTEGER,
  rooms_count INTEGER,
  has_living_room BOOLEAN DEFAULT FALSE,
  
  -- Amenities
  has_wifi BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_tv BOOLEAN DEFAULT FALSE,
  has_fridge BOOLEAN DEFAULT FALSE,
  has_washing_machine BOOLEAN DEFAULT FALSE,
  
  -- Video
  video_url TEXT,
  
  PRIMARY KEY (ad_id)
);

-- Guides table
CREATE TABLE public.ads_guides (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  city TEXT NOT NULL CHECK (city IN ('makkah', 'medina', 'both')),
  years_experience INTEGER NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  -- Services offered
  offers_omra_guidance BOOLEAN DEFAULT FALSE,
  offers_visits BOOLEAN DEFAULT FALSE,
  offers_courses BOOLEAN DEFAULT FALSE,
  offers_omra_badal BOOLEAN DEFAULT FALSE,
  offers_wheelchair_help BOOLEAN DEFAULT FALSE,
  offers_other BOOLEAN DEFAULT FALSE,
  other_services_description TEXT,
  
  PRIMARY KEY (ad_id)
);

-- Chauffeurs table
CREATE TABLE public.ads_chauffeurs (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  city TEXT NOT NULL CHECK (city IN ('makkah', 'medina', 'jeddah')),
  vehicle_seats INTEGER NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  PRIMARY KEY (ad_id)
);

-- Baby-sitting table
CREATE TABLE public.ads_babysitting (
  ad_id UUID NOT NULL REFERENCES public.ads ON DELETE CASCADE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  PRIMARY KEY (ad_id)
);

-- Enable RLS on all tables
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_sejours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_vols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_hebergements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_chauffeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_babysitting ENABLE ROW LEVEL SECURITY;

-- Create policies for ads table
CREATE POLICY "Anyone can view published ads"
ON public.ads FOR SELECT
USING (is_published = TRUE AND publish_end_date > NOW());

CREATE POLICY "Users can view their own ads"
ON public.ads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ads"
ON public.ads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads"
ON public.ads FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ads"
ON public.ads FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for category-specific tables
CREATE POLICY "Anyone can view published ad details"
ON public.ads_sejours FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_sejours.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_sejours FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_sejours.ad_id 
  AND ads.user_id = auth.uid()
));

-- Repeat policies for other category tables
CREATE POLICY "Anyone can view published ad details"
ON public.ads_vols FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_vols.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_vols FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_vols.ad_id 
  AND ads.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published ad details"
ON public.ads_hebergements FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_hebergements.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_hebergements FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_hebergements.ad_id 
  AND ads.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published ad details"
ON public.ads_guides FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_guides.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_guides FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_guides.ad_id 
  AND ads.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published ad details"
ON public.ads_chauffeurs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_chauffeurs.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_chauffeurs FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_chauffeurs.ad_id 
  AND ads.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published ad details"
ON public.ads_babysitting FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_babysitting.ad_id 
  AND (ads.is_published = TRUE AND ads.publish_end_date > NOW() OR ads.user_id = auth.uid())
));

CREATE POLICY "Users can manage their own ad details"
ON public.ads_babysitting FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.ads 
  WHERE ads.id = ads_babysitting.ad_id 
  AND ads.user_id = auth.uid()
));

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create validation trigger for publish_end_date
CREATE OR REPLACE FUNCTION public.validate_publish_end_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.publish_end_date <= NOW() THEN
    RAISE EXCEPTION 'La date de fin de publication doit être dans le futur';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_ads_publish_end_date
  BEFORE INSERT OR UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_publish_end_date();