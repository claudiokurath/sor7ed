import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const env: Record<string, string> = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) return;
    const key = trimmed.substring(0, equalIndex).trim();
    const value = trimmed.substring(equalIndex + 1).trim();
    if (key) env[key] = value;
  });
  return env;
}

const env = loadEnvironment();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log(`Querying Supabase protocols table...`);
  
  const { data, error } = await supabase
    .from('protocols')
    .select('slug, title, status')
    .or('slug.ilike.%tax%,title.ilike.%tax%,slug.ilike.%adhd%,title.ilike.%adhd%');

  if (error) {
    console.error('Error fetching protocols:', error);
  } else {
    console.log('Matching protocols in DB:', data);
  }
}

main().catch(console.error);
