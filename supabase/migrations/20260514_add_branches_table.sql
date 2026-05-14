create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  notion_id text unique,
  num text not null,
  name text not null,
  slug text unique not null,
  color text not null default '#ffffff',
  icon text,
  description text,
  cover_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
