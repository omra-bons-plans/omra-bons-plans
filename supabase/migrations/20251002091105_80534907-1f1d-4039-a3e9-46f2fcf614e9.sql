-- Corriger les images qui n'existent pas en .jpg mais en .webp
UPDATE blog_posts
SET cover_image = REGEXP_REPLACE(cover_image, '\.jpg$', '.webp', 'i')
WHERE cover_image IN (
  'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/vmpl8duebqg_1757421234244.jpg',
  'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/ozft0r63vqg_1757961383999.jpg',
  'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/pk8tr2ymxm_1757960896006.jpg'
);