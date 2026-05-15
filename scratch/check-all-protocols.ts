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

async function checkAllProtocols() {
  const dbId = env.NOTION_BLOG_DB_ID
  const response = await notion.databases.query({ 
    database_id: dbId, 
    filter: {
      property: 'Status',
      status: { equals: 'Published' }
    }
  })
  response.results.forEach((page: any) => {
    console.log(`${page.properties.Title.title[0]?.plain_text}: Cover Image 1 = ${page.properties['Cover Image 1']?.url}, Page Cover = ${page.cover?.type}`)
  })
}

checkAllProtocols().catch(console.error)
