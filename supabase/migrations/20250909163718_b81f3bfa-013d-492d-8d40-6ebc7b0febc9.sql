-- Ajouter les champs de contact pour les blogs vendeurs
ALTER TABLE public.blog_posts 
ADD COLUMN contact_phone text,
ADD COLUMN contact_instagram text;