-- Enable realtime for chat and notification tables

-- Set replica identity to FULL for all tables that need realtime
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.topic_requests REPLICA IDENTITY FULL;
ALTER TABLE public.chat_topics REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.topic_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_topics;