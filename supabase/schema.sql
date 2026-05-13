-- Saved/favorite tools and protocols
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('tool', 'protocol')),
  item_slug TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_keyword TEXT NOT NULL,
  item_color TEXT,
  item_branch TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_type, item_slug)
);

-- Assessment completion history
CREATE TABLE assessment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Protocol usage tracking (for WhatsApp webhook integration)
CREATE TABLE protocol_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  source TEXT DEFAULT 'whatsapp',
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX user_favorites_user_id_idx ON user_favorites(user_id);
CREATE INDEX assessment_history_user_id_idx ON assessment_history(user_id);
CREATE INDEX protocol_usage_user_id_idx ON protocol_usage(user_id);

-- Enable Row Level Security
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_usage ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users own their favorites" ON user_favorites
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users own their history" ON assessment_history
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users own their usage data" ON protocol_usage
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Add status column to protocols and tools
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Live';
ALTER TABLE tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Live';

-- WhatsApp Bridge Sessions
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  tool_slug TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed BOOLEAN NOT NULL DEFAULT FALSE,
  source_keyword TEXT,
  target_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_token ON whatsapp_sessions(token);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_phone ON whatsapp_sessions(phone);
