-- Ajouter une contrainte unique sur base_currency et target_currency
ALTER TABLE exchange_rates 
ADD CONSTRAINT exchange_rates_base_target_unique 
UNIQUE (base_currency, target_currency);