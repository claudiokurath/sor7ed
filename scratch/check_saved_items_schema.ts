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
  const { data, error } = await supabase.rpc('get_schema_info', {})
  // If rpc doesn't exist, query postgrest OpenAPI spec
  console.log('Querying OpenAPI schema from Supabase PostgREST endpoint...')
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
    if (res.ok) {
      const schema = await res.json()
      console.log('Tables found in definitions:', Object.keys(schema.definitions))
      console.log('\nsaved_items properties:', schema.definitions.saved_items?.properties)
      console.log('\nrich_links properties:', schema.definitions.rich_links?.properties)
      console.log('\nusers properties:', schema.definitions.users?.properties)
    } else {
      console.error('Fetch failed:', res.status, await res.text())
    }
  } catch (err: any) {
    console.error('Error fetching schema info:', err)
  }
}

main()
