-- supabase/migrations/20240102_run_usage.sql  
CREATE TABLE IF NOT EXISTS run_usage (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wa_id   TEXT NOT NULL UNIQUE,
  runs_used    INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_run_usage_user_wa_id ON run_usage (user_wa_id);

-- Atomic increment function
CREATE OR REPLACE FUNCTION increment_run_usage(p_user_wa_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO run_usage (user_wa_id, runs_used)
  VALUES (p_user_wa_id, 1)
  ON CONFLICT (user_wa_id)
  DO UPDATE SET
    runs_used = run_usage.runs_used + 1,
    updated_at = NOW()
  RETURNING runs_used INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;
