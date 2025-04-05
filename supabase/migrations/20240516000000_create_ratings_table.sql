
-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES public.profiles(id),
  rated_id UUID NOT NULL REFERENCES public.profiles(id),
  rating DECIMAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_for_creator BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_rating_per_task_and_role UNIQUE(task_id, rater_id, is_for_creator)
);

-- Add RLS policies for ratings table
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Users can read all ratings
CREATE POLICY "Anyone can read ratings" 
ON public.ratings FOR SELECT 
USING (true);

-- Only the rater can insert their own ratings
CREATE POLICY "Users can insert their own ratings" 
ON public.ratings FOR INSERT 
WITH CHECK (auth.uid() = rater_id);

-- Only the rater can update their own ratings
CREATE POLICY "Users can update their own ratings" 
ON public.ratings FOR UPDATE 
USING (auth.uid() = rater_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.ratings TO authenticated;
