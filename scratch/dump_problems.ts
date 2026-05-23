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
    .select('slug, title, problem')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching protocols:', error);
    return;
  }

  console.log(`Fetched ${protocols?.length} protocols:\n`);
  for (const p of protocols || []) {
    console.log(`=========================================`);
    console.log(`SLUG: ${p.slug}`);
    console.log(`TITLE: ${p.title}`);
    console.log(`PROBLEM LENGTH: ${p.problem?.length || 0}`);
    console.log(`CONTENT (first 400 chars):`);
    console.log(p.problem ? p.problem.substring(0, 400) : 'EMPTY');
    console.log(`=========================================\n`);
  }

  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('slug, name, description')
    .order('created_at', { ascending: false });

  if (toolsError) {
    console.error('Error fetching tools:', toolsError);
    return;
  }

  console.log(`Fetched ${tools?.length} tools:\n`);
  for (const t of tools || []) {
    console.log(`=========================================`);
    console.log(`SLUG: ${t.slug}`);
    console.log(`NAME: ${t.name}`);
    console.log(`DESCRIPTION LENGTH: ${t.description?.length || 0}`);
    console.log(`CONTENT (first 400 chars):`);
    console.log(t.description ? t.description.substring(0, 400) : 'EMPTY');
    console.log(`=========================================\n`);
  }
}

main().catch(console.error);
