DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'analytics_events'
  ) THEN
    EXECUTE 'ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY';

    IF EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND policyname = 'analytics_events_select_all'
    ) THEN
      EXECUTE 'DROP POLICY analytics_events_select_all ON public.analytics_events';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'analytics_events'
        AND policyname = 'analytics_events_select_admin'
    ) THEN
      EXECUTE $pol$
        CREATE POLICY analytics_events_select_admin
        ON public.analytics_events
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1
            FROM public.user_profiles up
            WHERE up.id = auth.uid()
              AND (
                coalesce(to_jsonb(up.roles), '[]'::jsonb) ? 'admin'
              )
          )
        )
      $pol$;
    END IF;
  END IF;
END $$;

