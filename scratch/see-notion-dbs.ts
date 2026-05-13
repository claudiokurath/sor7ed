import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function seeAll() {
  try {
    const response = await notion.search({ filter: { property: 'object', value: 'database' } })
    console.log('Databases accessible to integration:')
    response.results.forEach((db: any) => {
      console.log(`- ${db.title?.[0]?.plain_text || 'Untitled'}: ${db.id}`)
    })
  } catch (error: any) {
    console.error('Notion Error:', error.body || error.message)
  }
}

seeAll()
