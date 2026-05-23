import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach((line) => {
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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function inspect() {
  const { data, error } = await supabase
    .from('tools')
    .select('slug, name, status, branch, featured')
  
  if (error) {
    console.error('Error fetching tools:', error.message)
    return
  }
  
  console.log(`Found ${data?.length} tools in database:`)
  console.log(JSON.stringify(data, null, 2))
}

inspect().catch(console.error)
