import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'protocols' })
  if (error) {
    console.error('Error fetching columns:', error)
    // Fallback: try a query and check keys
    const { data: sample } = await supabase.from('protocols').select('*').limit(1)
    if (sample && sample[0]) {
      console.log('Columns in protocols:', Object.keys(sample[0]))
    }
  } else {
    console.log('Columns in protocols:', data)
  }

  const { data: toolSample } = await supabase.from('tools').select('*').limit(1)
  if (toolSample && toolSample[0]) {
    console.log('Columns in tools:', Object.keys(toolSample[0]))
  }
}

checkSchema()
