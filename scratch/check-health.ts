import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function checkHealth() {
  console.log('Checking database tables...')
  
  const { data: protocols, error: pError } = await supabase.from('protocols').select('count', { count: 'exact', head: true })
  console.log(`Protocols count: ${protocols?.length || 0} (Error: ${pError?.message || 'none'})`)
  
  const { data: tools, error: tError } = await supabase.from('tools').select('count', { count: 'exact', head: true })
  console.log(`Tools count: ${tools?.length || 0} (Error: ${tError?.message || 'none'})`)
  
  // Check columns
  const { data: tSample } = await supabase.from('tools').select('*').limit(1)
  console.log('Tools columns:', Object.keys(tSample?.[0] || {}))
}

checkHealth()
