-- Set replica identity to FULL for all tables that need realtime
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.topic_requests REPLICA IDENTITY FULL;
ALTER TABLE public.chat_topics REPLICA IDENTITY FULL;