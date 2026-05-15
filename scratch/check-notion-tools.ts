import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function checkNotionTools() {
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
  })

  console.log(`Found ${response.results.length} tools in Notion.`)
  response.results.forEach((page: any) => {
    const props = page.properties
    const name = props.Name?.title?.[0]?.plain_text || 'Untitled'
    const status = props.Status?.status?.name || 'No Status'
    const branch = props.Branch?.select?.name || 'No Branch'
    console.log(`- ${name} [${branch}]: ${status}`)
  })
}

checkNotionTools()
