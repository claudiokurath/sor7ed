import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    env[key.trim()] = rest.join('=').trim();
  }
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'] || '', env['SUPABASE_SERVICE_ROLE_KEY'] || '');

async function checkImages() {
  console.log('--- Protocols ---');
  const { data: protocols } = await supabase.from('protocols').select('title, cover_image').limit(3);
  console.log(JSON.stringify(protocols, null, 2));

  console.log('\n--- Tools ---');
  const { data: tools } = await supabase.from('tools').select('name, cover_image').limit(3);
  console.log(JSON.stringify(tools, null, 2));
}

checkImages();
