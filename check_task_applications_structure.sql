-- Check task_applications table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'task_applications'
AND table_schema = 'public';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'task_applications';

-- Check existing indices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'task_applications'
AND schemaname = 'public';

-- Check if table is in realtime publication
SELECT pubname, tablename
FROM pg_publication_tables
WHERE tablename = 'task_applications';