import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function checkData() {
  const { count: pCount, error: pError } = await supabase.from('protocols').select('*', { count: 'exact', head: true })
  console.log(`Protocols Count: ${pCount} (Error: ${pError?.message || 'none'})`)

  const { count: tCount, error: tError } = await supabase.from('tools').select('*', { count: 'exact', head: true })
  console.log(`Tools Count: ${tCount} (Error: ${tError?.message || 'none'})`)

  const { data: liveTools } = await supabase.from('tools').select('name').eq('status', 'Live')
  console.log('Live Tools:', liveTools?.map(t => t.name))
}

checkData()
