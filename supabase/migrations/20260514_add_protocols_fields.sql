-- Add missing columns to protocols table required by sync-notion.ts
ALTER TABLE protocols
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS level text DEFAULT 'primer',
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS related_assessments jsonb DEFAULT '[]';

-- Add missing columns to assessment_history required by dashboard
ALTER TABLE assessment_history
  ADD COLUMN IF NOT EXISTS score integer,
  ADD COLUMN IF NOT EXISTS level text;
