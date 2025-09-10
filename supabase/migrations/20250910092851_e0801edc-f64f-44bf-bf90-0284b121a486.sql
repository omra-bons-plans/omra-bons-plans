-- Corriger la politique de sécurité pour les messages de chat
-- Supprimer la politique actuelle qui permet à tout le monde de voir les messages
DROP POLICY IF EXISTS "Anyone can view all chat messages" ON public.chat_messages;

-- Créer une nouvelle politique qui limite l'accès aux utilisateurs authentifiés seulement
CREATE POLICY "Authenticated users can view all chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);