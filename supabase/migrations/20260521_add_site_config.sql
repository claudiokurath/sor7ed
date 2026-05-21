-- Create site_config table to store Notion-synced styling, copy, and image assets
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  value_text text,
  value_color text,
  image_url text,
  description text,
  active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast lookups by key
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read of site_config
CREATE POLICY "Allow public read of site_config" ON site_config
  FOR SELECT USING (true);
