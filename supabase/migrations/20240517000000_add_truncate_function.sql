
-- Function to truncate task application cache
CREATE OR REPLACE FUNCTION public.truncate_task_application_cache()
RETURNS void AS $$
BEGIN
  -- Delete task applications older than 30 days that are in pending status
  DELETE FROM public.task_applications
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND status = 'pending';
  
  -- Update expired task applications to 'expired' status
  UPDATE public.task_applications
  SET status = 'expired'
  WHERE created_at < NOW() - INTERVAL '14 days'
  AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Grant execution privileges to authenticated users
GRANT EXECUTE ON FUNCTION public.truncate_task_application_cache() TO authenticated;
GRANT EXECUTE ON FUNCTION public.truncate_task_application_cache() TO service_role;

-- Enable RLS on task_applications if not already enabled
ALTER TABLE public.task_applications ENABLE ROW LEVEL SECURITY;

-- Make sure task_applications has proper indices
CREATE INDEX IF NOT EXISTS idx_task_applications_status ON public.task_applications(status);
CREATE INDEX IF NOT EXISTS idx_task_applications_created_at ON public.task_applications(created_at);

-- Make sure realtime is enabled for task_applications
ALTER TABLE public.task_applications REPLICA IDENTITY FULL;

-- Only add to publication if not already a member
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'task_applications'
    AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.task_applications;
  END IF;
END
$$;
