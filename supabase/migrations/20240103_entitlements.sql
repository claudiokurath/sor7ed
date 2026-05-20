-- supabase/migrations/20240103_entitlements.sql
CREATE TABLE IF NOT EXISTS entitlements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wa_id   TEXT NOT NULL,
  plan         TEXT NOT NULL DEFAULT 'unlimited',
  valid_until  TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entitlements_user_wa_id ON entitlements (user_wa_id);
CREATE INDEX idx_entitlements_valid_until ON entitlements (valid_until);
