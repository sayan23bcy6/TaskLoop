
-- Function to reject a task application and ensure data consistency
CREATE OR REPLACE FUNCTION public.reject_task_application(application_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success INTEGER;
BEGIN
  -- Update the status of the application to 'rejected'
  UPDATE public.task_applications
  SET status = 'rejected'
  WHERE id = application_id;
  
  -- Check if the update was successful
  GET DIAGNOSTICS success = ROW_COUNT;
  
  -- Return true if at least one row was updated, false otherwise
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.reject_task_application(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_task_application(UUID) TO service_role;

-- Add index for better query performance on task applications status
CREATE INDEX IF NOT EXISTS idx_task_applications_applicant_id ON public.task_applications(applicant_id);

-- Make sure RLS is enabled 
ALTER TABLE public.task_applications ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policy for task applications
DROP POLICY IF EXISTS "Users can view their task applications" ON public.task_applications;
CREATE POLICY "Users can view their task applications" 
ON public.task_applications FOR SELECT 
TO authenticated 
USING (
  -- Users can see applications they've created
  applicant_id = auth.uid() OR 
  -- Or applications for tasks they've created
  task_id IN (
    SELECT id FROM public.tasks 
    WHERE creator_id = auth.uid()
  )
);

-- Make sure realtime is properly enabled for task_applications
ALTER TABLE public.task_applications REPLICA IDENTITY FULL;
