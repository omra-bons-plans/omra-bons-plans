-- Supprimer toutes les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Secure profile access" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their full profile and admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Créer une politique sécurisée qui remplace toutes les anciennes politiques
CREATE POLICY "Restricted profile access - owner and admin only"
ON public.profiles
FOR SELECT
USING (
  -- Les utilisateurs peuvent voir leur propre profil complet (toutes les colonnes)
  auth.uid() = id 
  OR 
  -- Les admins peuvent voir tous les profils complets
  is_admin()
);

-- Les politiques pour UPDATE et INSERT restent inchangées car elles sont sécurisées
-- Nous gardons seulement les politiques sécurisées existantes