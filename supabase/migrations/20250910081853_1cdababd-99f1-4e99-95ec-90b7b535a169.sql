-- Ajouter la colonne contact_phone_country à la table blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN contact_phone_country text DEFAULT '+33';