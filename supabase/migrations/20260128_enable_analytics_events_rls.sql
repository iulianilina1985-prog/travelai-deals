DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'analytics_events'
  ) THEN
    EXECUTE 'ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY';

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND policyname = 'analytics_events_insert_all'
    ) THEN
      EXECUTE 'CREATE POLICY analytics_events_insert_all ON public.analytics_events FOR INSERT WITH CHECK (true)';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND policyname = 'analytics_events_select_all'
    ) THEN
      EXECUTE 'CREATE POLICY analytics_events_select_all ON public.analytics_events FOR SELECT USING (true)';
    END IF;
  END IF;
END $$;
