import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function checkSample() {
  try {
    const response = await notion.databases.query({ database_id: env.NOTION_TOOLS_DB_ID, page_size: 1 })
    console.log('Sample Page:', JSON.stringify(response.results[0], null, 2))
  } catch (error: any) {
    console.error('Notion Error:', error.body || error.message)
  }
}

checkSample()
