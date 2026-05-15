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

async function checkTools() {
  const { data, count, error } = await supabase
    .from('tools')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  console.log(`Total tools in DB: ${count}`)
  console.log('Tools:', data.map(t => ({ name: t.name, status: t.status, branch: t.branch })))
}

checkTools()
