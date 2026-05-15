import { Client } from '@notionhq/client'
import * as fs from 'fs'
import * as path from 'path'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function checkProps() {
  const dbId = env.NOTION_TOOLS_DB_ID
  const db = await notion.databases.retrieve({ database_id: dbId })
  console.log('--- Tools DB Properties ---')
  console.log(Object.keys(db.properties).join(', '))
}

checkProps().catch(console.error)
