-- Test script for user_favorites table
-- Run this in Supabase SQL Editor to verify the migration

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_favorites'
);

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_favorites'
ORDER BY ordinal_position;

-- 3. Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_favorites';

-- 4. Check RLS policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_favorites';

-- 5. Test insert (will fail if not authenticated, which is correct)
-- This should be run from the application, not directly
-- INSERT INTO user_favorites (user_id, offer_id, offer_type, provider, offer_snapshot, affiliate_link)
-- VALUES (auth.uid(), 'test-offer-1', 'flight', 'Aviasales', '{"test": true}'::jsonb, 'https://example.com');
