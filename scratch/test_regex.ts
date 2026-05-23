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

function preCleanRunins(text: string): string {
  if (!text) return '';
  
  let cleaned = text;

  // Pattern 1: lowercase/number + punctuation + uppercase title/heading + newline
  // e.g. "cost.Expected Results\n" or "themselves.THE QUIET REBEL'S...\n"
  const runInRegex1 = /([a-z0-9][.!?])([A-Z][A-Z\s’'‑-]{3,}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?=\n)/g;
  cleaned = cleaned.replace(runInRegex1, '$1\n\n$2');

  // Pattern 2: uppercase letter directly followed by STEP/PHASE + number
  // e.g. "GUIDESTEP 1" -> "GUIDE\n\nSTEP 1"
  const runInRegex2 = /([A-Z])(STEP\s+\d+|PHASE\s+\d+)\b/g;
  cleaned = cleaned.replace(runInRegex2, '$1\n\n$2');

  return cleaned;
}

async function main() {
  const { data: protocols } = await supabase.from('protocols').select('slug, title, problem, protocol');
  const { data: tools } = await supabase.from('tools').select('slug, name, description');

  console.log("=== PROTOCOLS (PROBLEM) ===");
  for (const p of protocols || []) {
    const original = p.problem || '';
    const cleaned = preCleanRunins(original);
    if (original !== cleaned) {
      console.log(`SLUG: ${p.slug}`);
      console.log(`Original: ...${original.substring(original.indexOf('THE QUIET REBEL') - 30, original.indexOf('THE QUIET REBEL') + 50)}...`);
      console.log(`Cleaned: ...${cleaned.substring(cleaned.indexOf('THE QUIET REBEL') - 30, cleaned.indexOf('THE QUIET REBEL') + 50)}...`);
    }
  }

  console.log("\n=== PROTOCOLS (PROTOCOL) ===");
  for (const p of protocols || []) {
    const original = p.protocol || '';
    const cleaned = preCleanRunins(original);
    if (original !== cleaned) {
      console.log(`SLUG: ${p.slug}`);
      const idx = cleaned.indexOf('STEP 1');
      console.log(`Original: ...${original.substring(idx - 25, idx + 45)}...`);
      console.log(`Cleaned: ...${cleaned.substring(idx - 25, idx + 45)}...`);
    }
  }

  console.log("\n=== TOOLS (DESCRIPTION) ===");
  for (const t of tools || []) {
    const original = t.description || '';
    const cleaned = preCleanRunins(original);
    if (original !== cleaned) {
      console.log(`SLUG: ${t.slug}`);
      // Find one of the matches
      const idx = cleaned.indexOf('Expected Results');
      if (idx !== -1) {
        console.log(`Original: ...${original.substring(idx - 25, idx + 45)}...`);
        console.log(`Cleaned: ...${cleaned.substring(idx - 25, idx + 45)}...`);
      } else {
        console.log(`Original: ${original.substring(0, 150)}...`);
        console.log(`Cleaned: ${cleaned.substring(0, 150)}...`);
      }
    }
  }
}

main().catch(console.error);
