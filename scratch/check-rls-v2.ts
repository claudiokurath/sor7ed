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
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkAnonAccess() {
  const { data: protocols, error: pError } = await supabase.from('protocols').select('*')
  const { data: tools, error: tError } = await supabase.from('tools').select('*')

  console.log('Anon access to Protocols:', pError ? `Error: ${pError.message}` : `Found ${protocols?.length || 0} rows`)
  console.log('Anon access to Tools:', tError ? `Error: ${tError.message}` : `Found ${tools?.length || 0} rows`)
}

checkAnonAccess()
