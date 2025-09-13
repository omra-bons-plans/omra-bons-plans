-- Create chat_topics table for organizing discussions by themes
CREATE TABLE public.chat_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_pinned BOOLEAN DEFAULT false,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Add topic_id and parent_id to chat_messages for threading
ALTER TABLE public.chat_messages 
ADD COLUMN topic_id UUID REFERENCES public.chat_topics(id) ON DELETE CASCADE,
ADD COLUMN parent_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
ADD COLUMN mentions TEXT[] DEFAULT '{}';

-- Enable RLS
ALTER TABLE public.chat_topics ENABLE ROW LEVEL SECURITY;

-- Policies for chat_topics
CREATE POLICY "Anyone can view chat topics" 
ON public.chat_topics 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create topics" 
ON public.chat_topics 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their own topics" 
ON public.chat_topics 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all topics" 
ON public.chat_topics 
FOR ALL 
USING (is_admin());

-- Function to update topic stats
CREATE OR REPLACE FUNCTION public.update_topic_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.topic_id IS NOT NULL THEN
    UPDATE public.chat_topics 
    SET 
      message_count = message_count + 1,
      last_message_at = NEW.created_at
    WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' AND OLD.topic_id IS NOT NULL THEN
    UPDATE public.chat_topics 
    SET message_count = GREATEST(0, message_count - 1)
    WHERE id = OLD.topic_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update topic stats
CREATE TRIGGER update_chat_topics_stats
  AFTER INSERT OR DELETE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_topic_stats();

-- Create updated_at trigger for chat_topics
CREATE TRIGGER update_chat_topics_updated_at
  BEFORE UPDATE ON public.chat_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default topics
INSERT INTO public.chat_topics (title, description, theme, color, created_by) VALUES
('Discussion générale', 'Discussions ouvertes sur tous les sujets', 'général', '#3B82F6', (SELECT id FROM auth.users LIMIT 1)),
('Conseils Omra', 'Partagez vos conseils et expériences pour le pèlerinage', 'omra', '#10B981', (SELECT id FROM auth.users LIMIT 1)),
('Hébergements', 'Discussions sur les logements à La Mecque et Médine', 'hébergement', '#F59E0B', (SELECT id FROM auth.users LIMIT 1)),
('Transports', 'Vols, transferts et moyens de transport', 'transport', '#EF4444', (SELECT id FROM auth.users LIMIT 1)),
('Questions pratiques', 'Questions techniques et pratiques', 'pratique', '#8B5CF6', (SELECT id FROM auth.users LIMIT 1));