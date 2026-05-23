import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

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
  const { data: protocols, error } = await supabase
    .from('protocols')
    .select('slug, title, protocol')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching protocols:', error);
    return;
  }

  console.log(`--- Protocols "protocol" field ---`);
  for (const p of protocols || []) {
    console.log(`SLUG: ${p.slug}`);
    console.log(`TITLE: ${p.title}`);
    console.log(`PROTOCOL VALUE:\n`, p.protocol ? p.protocol.substring(0, 2000) : 'EMPTY');
    console.log(`-----------------------------------------\n`);
  }

  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('slug, name, description')
    .order('created_at', { ascending: false });

  if (toolsError) {
    console.error('Error fetching tools:', toolsError);
    return;
  }

  console.log(`--- Tools "description" field ---`);
  for (const t of tools || []) {
    console.log(`SLUG: ${t.slug}`);
    console.log(`NAME: ${t.name}`);
    console.log(`DESCRIPTION VALUE:\n`, t.description ? t.description.substring(0, 2000) : 'EMPTY');
    console.log(`-----------------------------------------\n`);
  }
}

main().catch(console.error);
