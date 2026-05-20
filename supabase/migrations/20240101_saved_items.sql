-- supabase/migrations/20240101_saved_items.sql
CREATE TABLE IF NOT EXISTS saved_items (
  id            TEXT PRIMARY KEY,
  user_wa_id    TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('tool', 'blog', 'external')),
  source_id     TEXT,
  source_url    TEXT,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  og_image_url  TEXT NOT NULL DEFAULT '',
  target_url    TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_items_user_wa_id ON saved_items (user_wa_id);
CREATE INDEX idx_saved_items_source_id ON saved_items (source_id) WHERE source_id IS NOT NULL;

-- Row Level Security
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
