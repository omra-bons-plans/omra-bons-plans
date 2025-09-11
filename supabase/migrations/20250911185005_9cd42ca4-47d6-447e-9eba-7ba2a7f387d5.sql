-- Corriger le problème de sécurité de la fonction update_published_at
CREATE OR REPLACE FUNCTION update_published_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Si is_published passe à true et que published_at est null, on le met à jour
    IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    -- Si is_published passe à false, on remet published_at à null
    ELSIF NEW.is_published = false AND OLD.is_published = true THEN
        NEW.published_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path TO 'public';