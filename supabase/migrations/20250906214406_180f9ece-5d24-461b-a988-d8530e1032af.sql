-- Mise à jour des articles publiés sans published_at
UPDATE blog_posts 
SET published_at = created_at 
WHERE is_published = true AND published_at IS NULL;

-- Trigger pour automatiquement définir published_at quand is_published devient true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Si is_published passe de false à true et published_at est null
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  -- Si is_published passe de true à false, on remet published_at à null
  ELSIF NEW.is_published = false AND OLD.is_published = true THEN
    NEW.published_at = null;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer le trigger sur la table blog_posts
DROP TRIGGER IF EXISTS trigger_set_published_at ON blog_posts;
CREATE TRIGGER trigger_set_published_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();