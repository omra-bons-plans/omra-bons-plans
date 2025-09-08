-- Fix security vulnerability: Replace overly permissive chat message viewing policy
-- Drop the insecure policy that allows anyone to view all chat messages
DROP POLICY IF EXISTS "Anyone can view chat messages" ON public.chat_messages;

-- Create a secure policy that only allows users to view their own messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: Admins can already view all messages via the existing "Admins can manage all chat messages" policy