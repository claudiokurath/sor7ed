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
