-- Rétablir le tchat public selon les besoins de l'utilisateur
-- Supprimer la politique restrictive qui limite la lecture aux propriétaires
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;

-- Créer une nouvelle politique qui permet à tout le monde de lire les messages
CREATE POLICY "Anyone can view all chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Note: La politique "Authenticated users can create messages" reste en place
-- pour s'assurer que seuls les utilisateurs connectés peuvent écrire