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
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function testTable(tableName: string) {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1)
    if (error) {
      console.log(`Table '${tableName}': Error -> ${error.message} (${error.code})`)
    } else {
      console.log(`Table '${tableName}': Success -> Found ${data?.length} records`)
    }
  } catch (err: any) {
    console.log(`Table '${tableName}': Exception -> ${err.message}`)
  }
}

async function run() {
  await testTable('site_config')
  await testTable('site_images')
  await testTable('banners')
  await testTable('rich_links')
  await testTable('protocols')
  await testTable('tools')
}

run().catch(console.error)
