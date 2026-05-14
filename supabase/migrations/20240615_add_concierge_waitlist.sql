-- supabase/migrations/20240615_add_concierge_waitlist.sql

CREATE TABLE concierge_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  phone text,
  email text,
  source_branch text NOT NULL,
  assessment_score integer NOT NULL,
  source_tool text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  contacted boolean DEFAULT false
);

CREATE INDEX idx_concierge_waitlist_status ON concierge_waitlist(status);
CREATE INDEX idx_concierge_waitlist_branch ON concierge_waitlist(source_branch);
