-- Add is_complet column to omra_offers table
ALTER TABLE omra_offers 
ADD COLUMN is_complet boolean DEFAULT false NOT NULL;