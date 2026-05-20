import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    env[key.trim()] = rest.join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlug() {
  const slug = 'relapse-recovery-spiral';
  console.log(`Checking for slug: ${slug}`);

  const { data, error } = await supabase
    .from('protocols')
    .select('id, title, status, slug')
    .eq('slug', slug);

  if (error) {
    console.error('Error fetching protocol:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Found protocol:', data);
  } else {
    console.log('No protocol found with that slug.');
    
    // Let's check similar slugs or all protocols to see what's there
    const { data: allProtocols } = await supabase
      .from('protocols')
      .select('title, slug, status')
      .limit(10);
      
    console.log('Recent protocols:', allProtocols);
  }
}

checkSlug();
