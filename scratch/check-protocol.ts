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

async function checkProtocol() {
  const dbId = env.NOTION_BLOG_DB_ID
  const response = await notion.databases.query({ database_id: dbId, limit: 1 })
  console.log(JSON.stringify(response.results[0], null, 2))
}

checkProtocol().catch(console.error)
