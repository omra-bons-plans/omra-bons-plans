CREATE POLICY "Public can read hotel presets" ON public.hotel_presets FOR SELECT USING (true);
GRANT SELECT ON public.hotel_presets TO anon;
GRANT SELECT ON public.hotel_presets TO authenticated;