import { Client } from '@notionhq/client'
import * as fs from 'fs'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) return
    const key = trimmed.substring(0, equalIndex).trim()
    const value = trimmed.substring(equalIndex + 1).trim()
    if (key) env[key] = value
  })
  return env
}

const env = loadEnvironment()
const notion = new Client({ auth: env.NOTION_API_KEY })

async function inspect(dbId: string, name: string) {
  try {
    console.log(`Inspecting Database ${name} (${dbId})...`)
    const db = await notion.databases.retrieve({ database_id: dbId })
    console.log('Properties:', Object.keys(db.properties))
    const query = await notion.databases.query({ database_id: dbId, page_size: 5 })
    console.log(`Found ${query.results.length} items.`)
    for (const page of query.results) {
      const p = page as any
      const title = p.properties?.Name?.title?.[0]?.plain_text || p.properties?.Title?.title?.[0]?.plain_text || p.properties?.Key?.title?.[0]?.plain_text || 'Untitled'
      console.log(`  - Item: ${title} (ID: ${p.id})`)
    }
  } catch (err: any) {
    console.error(`Error inspecting ${name}:`, err.message)
  }
}

async function run() {
  await inspect('34f0d601-4acc-81aa-b972-dcb615349abe', 'BANNERS')
  await inspect('2b80d601-4acc-80c2-a871-cde808fc3fd6', 'FILES')
}

run().catch(console.error)
