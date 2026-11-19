-- Add slug column to ads table for human-readable URLs
-- URL: /ad/mon-logement-a-medine instead of /ad/c9470696-...

CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE ads ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS ads_slug_unique ON ads(slug) WHERE slug IS NOT NULL;

-- Convert title to URL-friendly slug
CREATE OR REPLACE FUNCTION slugify(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(
    trim(both '-' from
      regexp_replace(
        regexp_replace(
          unaccent(trim(input)),
          '[^a-zA-Z0-9]+', '-', 'g'
        ),
        '-{2,}', '-', 'g'
      )
    )
  );
END;
$$;

-- Generate unique slug for an ad (appends -2, -3, ... on collision)
CREATE OR REPLACE FUNCTION generate_unique_ad_slug(p_title TEXT, p_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  candidate TEXT;
  suffix INT := 0;
BEGIN
  base_slug := substring(slugify(p_title), 1, 70);
  base_slug := trim(both '-' from base_slug);
  candidate := base_slug;

  LOOP
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM ads WHERE slug = candidate AND id != p_id
    );
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Trigger: auto-generate slug on insert or title change
CREATE OR REPLACE FUNCTION ads_set_slug_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.title IS DISTINCT FROM NEW.title) THEN
    NEW.slug := generate_unique_ad_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ads_auto_slug ON ads;
CREATE TRIGGER ads_auto_slug
  BEFORE INSERT OR UPDATE OF title ON ads
  FOR EACH ROW
  EXECUTE FUNCTION ads_set_slug_trigger();

-- Backfill slugs for all existing ads
UPDATE ads SET slug = generate_unique_ad_slug(title, id) WHERE slug IS NULL;
