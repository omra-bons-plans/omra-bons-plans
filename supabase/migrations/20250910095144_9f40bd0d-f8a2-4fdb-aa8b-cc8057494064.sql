-- Restaurer la politique originale pour permettre l'accès public aux messages de chat
-- Supprimer la politique restrictive actuelle
DROP POLICY IF EXISTS "Authenticated users can view all chat messages" ON public.chat_messages;

-- Créer la politique qui permet à tout le monde de voir les messages
CREATE POLICY "Anyone can view all chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);