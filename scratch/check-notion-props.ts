import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function checkProperties() {
  try {
    const response = await notion.databases.retrieve({ database_id: env.NOTION_TOOLS_DB_ID })
    console.log('Properties found in Notion:', Object.keys(response.properties))
  } catch (error: any) {
    console.error('Notion Error:', error.body || error.message)
  }
}

checkProperties()
