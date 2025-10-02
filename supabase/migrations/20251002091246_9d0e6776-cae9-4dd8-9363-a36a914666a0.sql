-- Corriger les extensions des 3 images qui sont en .png dans le bucket
UPDATE blog_posts
SET cover_image = CASE 
  WHEN cover_image LIKE '%ozft0r63vqg%' THEN 'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/ozft0r63vqg_1757961383999.png'
  WHEN cover_image LIKE '%pk8tr2ymxm%' THEN 'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/pk8tr2ymxm_1757960896006.png'
  WHEN cover_image LIKE '%vmpl8duebqg%' THEN 'https://lptyhenryzhztdwpkvsc.supabase.co/storage/v1/object/public/blog-images/blog/vmpl8duebqg_1757421234244.png'
END
WHERE cover_image LIKE '%ozft0r63vqg%' 
   OR cover_image LIKE '%pk8tr2ymxm%'
   OR cover_image LIKE '%vmpl8duebqg%';