-- Ajouter le champ scheduled_publish_at à la table blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN scheduled_publish_at TIMESTAMP WITH TIME ZONE;