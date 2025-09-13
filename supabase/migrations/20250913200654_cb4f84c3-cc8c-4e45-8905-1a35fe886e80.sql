-- Create topic_requests table for user requests
CREATE TABLE public.topic_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT NOT NULL,
  justification TEXT,
  requested_by UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topic_requests ENABLE ROW LEVEL SECURITY;

-- Policies for topic_requests
CREATE POLICY "Users can view their own requests" 
ON public.topic_requests 
FOR SELECT 
USING (auth.uid() = requested_by);

CREATE POLICY "Users can create requests" 
ON public.topic_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Admins can manage all requests" 
ON public.topic_requests 
FOR ALL 
USING (is_admin());

-- Trigger to update updated_at
CREATE TRIGGER update_topic_requests_updated_at
  BEFORE UPDATE ON public.topic_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification when topic is requested
CREATE OR REPLACE FUNCTION public.notify_admins_new_topic_request()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get all admin users and create notifications
  FOR admin_user_id IN 
    SELECT ur.user_id 
    FROM public.user_roles ur 
    WHERE ur.role = 'admin'
  LOOP
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      related_type,
      related_id
    ) VALUES (
      admin_user_id,
      'topic_request',
      'Nouveau sujet proposé',
      'Un utilisateur souhaite créer un nouveau sujet : "' || NEW.title || '"',
      'topic_request',
      NEW.id
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to notify admins when new topic is requested
CREATE TRIGGER notify_admins_on_topic_request
  AFTER INSERT ON public.topic_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_topic_request();