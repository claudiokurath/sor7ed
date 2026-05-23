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

  console.log("=== PROTOCOLS (PROBLEM) ===");
  for (const p of protocols || []) {
    const text = p.problem || '';
    // Look for STEP \d, PHASE \d, INTRODUCTION, SUMMARY, or title-cased headings run-ins
    const matches = text.match(/([a-zA-Z0-9])(STEP|PHASE|INTRODUCTION|SUMMARY|ENCOURAGING NOTE|Expected Results|Customer Benefits|Timeframe for Completion|Target Audience|Usage Instructions)/g);
    if (matches) {
      console.log(`SLUG: ${p.slug} (${p.title})`);
      console.log(`  Matches:`, matches);
      matches.forEach(m => {
        const idx = text.indexOf(m);
        console.log(`  Context: ...${text.substring(idx - 20, idx + 40)}...`);
      });
    }
  }

  console.log("\n=== PROTOCOLS (PROTOCOL) ===");
  for (const p of protocols || []) {
    const text = p.protocol || '';
    const matches = text.match(/([a-zA-Z0-9])(STEP|PHASE|INTRODUCTION|SUMMARY|ENCOURAGING NOTE|Expected Results|Customer Benefits|Timeframe for Completion|Target Audience|Usage Instructions)/g);
    if (matches) {
      console.log(`SLUG: ${p.slug} (${p.title})`);
      console.log(`  Matches:`, matches);
      matches.forEach(m => {
        const idx = text.indexOf(m);
        console.log(`  Context: ...${text.substring(idx - 20, idx + 40)}...`);
      });
    }
  }

  console.log("\n=== TOOLS (DESCRIPTION) ===");
  for (const t of tools || []) {
    const text = t.description || '';
    const matches = text.match(/([a-zA-Z0-9])(STEP|PHASE|INTRODUCTION|SUMMARY|ENCOURAGING NOTE|Expected Results|Customer Benefits|Timeframe for Completion|Target Audience|Usage Instructions)/g);
    if (matches) {
      console.log(`SLUG: ${t.slug} (${t.name})`);
      console.log(`  Matches:`, matches);
      matches.forEach(m => {
        const idx = text.indexOf(m);
        console.log(`  Context: ...${text.substring(idx - 20, idx + 40)}...`);
      });
    }
  }
}

main().catch(console.error);
