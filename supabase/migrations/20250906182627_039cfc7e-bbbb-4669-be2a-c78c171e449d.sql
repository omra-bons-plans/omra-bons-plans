-- Add foreign key relationship between blog_posts and profiles
ALTER TABLE public.blog_posts 
ADD CONSTRAINT fk_blog_posts_author_id 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;