-- Create review_replies table for ad owners to reply to reviews
CREATE TABLE public.review_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL,
  ad_owner_id UUID NOT NULL,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for review replies
CREATE POLICY "Anyone can view review replies" 
ON public.review_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Ad owners can create replies to their ads' reviews" 
ON public.review_replies 
FOR INSERT 
WITH CHECK (
  auth.uid() = ad_owner_id AND 
  EXISTS (
    SELECT 1 FROM reviews r 
    JOIN ads a ON r.ad_id = a.id 
    WHERE r.id = review_id AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Ad owners can update their own replies" 
ON public.review_replies 
FOR UPDATE 
USING (auth.uid() = ad_owner_id);

CREATE POLICY "Ad owners can delete their own replies" 
ON public.review_replies 
FOR DELETE 
USING (auth.uid() = ad_owner_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_review_replies_updated_at
BEFORE UPDATE ON public.review_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();