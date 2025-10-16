-- Insérer les configurations de scraper pour toutes les agences
INSERT INTO public.omra_scraper_config (agency_name, agency_url, scraper_type, is_active, selectors) VALUES
('Tawaf', 'https://www.tawaf.fr/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Sabil Voyages', 'https://sabilevoyages.com/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Omra Pour Tous', 'https://omrapourtous.com/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Omra Sounnah', 'https://www.omrasounnah.com/omra/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Al Hayat Voyages', 'https://www.alhayat-voyages.com/omra/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Al Bayt', 'https://www.albayt.fr/produit/omra/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Pelerin Hajj', 'https://pelerinhajj.com/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Omra Du Savoir', 'https://www.omradusavoir.fr/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Al Maqam Voyages', 'https://almaqamvoyages.com/', 'html', true, '{"price": ".price", "title": ".offer-title"}'),
('Medin Voyages', 'https://medinvoyages.com/omras/', 'html', true, '{"price": ".price", "title": ".offer-title"}')
ON CONFLICT DO NOTHING;