-- Add foreign key constraint to chat_messages table
ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;