import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function searchVault() {
  try {
    const response = await notion.databases.query({ database_id: env.NOTION_TOOLS_DB_ID })
    for (const page of response.results as any) {
      const name = page.properties.Name?.title?.[0]?.plain_text || ''
      const value = page.properties.Value?.rich_text?.[0]?.plain_text || ''
      console.log(`Key: ${name}, Value: ${value}`)
    }
  } catch (error: any) {
    console.error('Notion Error:', error.body || error.message)
  }
}

searchVault()
