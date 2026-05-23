import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { cleanBlogPost, cleanProtocolField } from '../lib/utils/clean-blog'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) return
    const key = trimmed.substring(0, equalIndex).trim()
    const value = trimmed.substring(equalIndex + 1).trim()
    if (key) env[key] = value
  })
  return env
}

const env = loadEnvironment()
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  const { data: protocols } = await supabase
    .from('protocols')
    .select('slug, title, problem, protocol')
    .order('created_at', { ascending: false });

  console.log("=== PROTOCOLS ===");
  for (const p of protocols || []) {
    console.log(`SLUG: ${p.slug}`);
    console.log(`--- PROTOCOL FIELD ORIGINAL: ---`);
    console.log(p.protocol ? p.protocol.substring(0, 200) + '...' : 'EMPTY');
    const cleanedProtocol = cleanProtocolField(p.protocol || '', p.title);
    console.log(`--- PROTOCOL FIELD CLEANED: ---`);
    console.log(cleanedProtocol.substring(0, 300) + '...');
    console.log(`=========================================\n`);
  }

  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, description')
    .order('created_at', { ascending: false });

  console.log("=== TOOLS ===");
  for (const t of tools || []) {
    console.log(`SLUG: ${t.slug}`);
    console.log(`--- DESCRIPTION ORIGINAL: ---`);
    console.log(t.description ? t.description.substring(0, 200) + '...' : 'EMPTY');
    const cleanedDesc = cleanBlogPost(t.description || '', t.name);
    console.log(`--- DESCRIPTION CLEANED: ---`);
    console.log(cleanedDesc.substring(0, 300) + '...');
    console.log(`=========================================\n`);
  }
}

main().catch(console.error);
