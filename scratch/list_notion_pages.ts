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

async function run() {
  console.log('Searching Notion objects...')
  const response = await notion.search({
    filter: {
      property: 'object',
      value: 'page'
    }
  })
  console.log('Found pages:')
  for (const page of response.results) {
    const p = page as any
    const title = p.properties?.title?.title?.[0]?.plain_text || p.properties?.Name?.title?.[0]?.plain_text || 'Untitled'
    console.log(`Page: ${title} | ID: ${p.id}`)
  }

  const dbResponse = await notion.search({
    filter: {
      property: 'object',
      value: 'database'
    }
  })
  console.log('\nFound databases:')
  for (const db of dbResponse.results) {
    const d = db as any
    const title = d.title?.[0]?.plain_text || 'Untitled'
    console.log(`Database: ${title} | ID: ${d.id}`)
  }
}

run().catch(console.error)
