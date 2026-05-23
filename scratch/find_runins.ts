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
  const { data: protocols } = await supabase.from('protocols').select('slug, title, problem, protocol');
  const { data: tools } = await supabase.from('tools').select('slug, name, description');

  console.log("=== RUN-INS IN PROTOCOLS (PROBLEM) ===");
  for (const p of protocols || []) {
    const matches = (p.problem || '').match(/[a-z][.!?][A-Z][a-zA-Z]/g);
    if (matches) {
      console.log(`SLUG: ${p.slug} (${p.title})`);
      console.log(`Matches:`, matches);
      // Print context
      let idx = 0;
      while (true) {
        const matchIdx = (p.problem || '').indexOf(matches[idx], idx > 0 ? idx : 0);
        if (matchIdx === -1) break;
        console.log(`  Context: ...${p.problem.substring(matchIdx - 30, matchIdx + 40)}...`);
        idx = matchIdx + 1;
        if (idx >= p.problem.length) break;
      }
    }
  }

  console.log("\n=== RUN-INS IN PROTOCOLS (PROTOCOL) ===");
  for (const p of protocols || []) {
    const matches = (p.protocol || '').match(/[a-z][.!?][A-Z][a-zA-Z]/g);
    if (matches) {
      console.log(`SLUG: ${p.slug} (${p.title})`);
      console.log(`Matches:`, matches);
      let idx = 0;
      while (true) {
        const matchIdx = (p.protocol || '').indexOf(matches[idx], idx > 0 ? idx : 0);
        if (matchIdx === -1) break;
        console.log(`  Context: ...${p.protocol.substring(matchIdx - 30, matchIdx + 40)}...`);
        idx = matchIdx + 1;
        if (idx >= p.protocol.length) break;
      }
    }
  }

  console.log("\n=== RUN-INS IN TOOLS (DESCRIPTION) ===");
  for (const t of tools || []) {
    const matches = (t.description || '').match(/[a-z][.!?][A-Z][a-zA-Z]/g);
    if (matches) {
      console.log(`SLUG: ${t.slug} (${t.name})`);
      console.log(`Matches:`, matches);
      let idx = 0;
      while (true) {
        const matchIdx = (t.description || '').indexOf(matches[idx], idx > 0 ? idx : 0);
        if (matchIdx === -1) break;
        console.log(`  Context: ...${t.description.substring(matchIdx - 30, matchIdx + 40)}...`);
        idx = matchIdx + 1;
        if (idx >= t.description.length) break;
      }
    }
  }
}

main().catch(console.error);
