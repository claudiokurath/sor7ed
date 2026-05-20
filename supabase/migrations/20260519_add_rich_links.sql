-- Create rich_links table
CREATE TABLE IF NOT EXISTS rich_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  target_url text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create rich_link_clicks table for tracking
CREATE TABLE IF NOT EXISTS rich_link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES rich_links(id) ON DELETE CASCADE,
  clicked_at timestamptz DEFAULT now(),
  user_agent text
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rich_links_slug ON rich_links(slug);
CREATE INDEX IF NOT EXISTS idx_rich_link_clicks_link_id ON rich_link_clicks(link_id);

-- Enable RLS if needed, or leave open for now depending on use case
-- For now, we'll assume it's managed by service role or public read
ALTER TABLE rich_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rich_link_clicks ENABLE ROW LEVEL SECURITY;

-- Allow public read of rich_links (needed for the redirect page)
CREATE POLICY "Allow public read of rich_links" ON rich_links
  FOR SELECT USING (true);

-- Allow public insert of clicks (needed for tracking)
CREATE POLICY "Allow public insert of rich_link_clicks" ON rich_link_clicks
  FOR INSERT WITH CHECK (true);
