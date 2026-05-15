import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkSchema() {
  const { data, error } = await supabase.from('tools').select('*').limit(1)
  if (error) {
    console.error('Error:', error)
    return
  }
  console.log('Columns:', Object.keys(data[0] || {}))
}

checkSchema()
