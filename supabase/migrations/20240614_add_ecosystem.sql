-- Add ecosystem columns to users table
ALTER TABLE auth.users ADD COLUMN ecosystem_tier text DEFAULT 'free';
ALTER TABLE auth.users ADD COLUMN concierge_credits integer DEFAULT 0;
ALTER TABLE auth.users ADD COLUMN sonicglue_access boolean DEFAULT false;
ALTER TABLE auth.users ADD COLUMN primary_branch text;

-- Create activity tracking table
CREATE TABLE ecosystem_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product text NOT NULL, -- 'lab' | 'concierge' | 'sonicglue'
  action_type text NOT NULL,
  branch text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
