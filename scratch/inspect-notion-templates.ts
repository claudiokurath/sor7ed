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

const getText = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  const p = prop as { rich_text?: Array<{ plain_text: string }>; title?: Array<{ plain_text: string }> };
  if (p.rich_text) return p.rich_text.map(t => t.plain_text).join('');
  if (p.title) return p.title.map(t => t.plain_text).join('');
  return '';
};

async function inspectTemplates() {
  const dbId = '08ac767d-3138-45ca-9188-6ce45c379b99'
  const response = await notion.databases.query({
    database_id: dbId
  })

  for (const page of response.results) {
    const p = page as any
    const name = getText(p.properties.Name)
    const template = getText(p.properties.Template)
    const status = p.properties.Status?.status?.name || 'No Status'
    const slug = getText(p.properties.Slug)
    console.log(`Tool: "${name}" | Slug: "${slug}" | Status: "${status}"`)
    console.log(`Template Value:`, template ? template.substring(0, 300) + '...' : '(empty)')
    console.log('-'.repeat(40))
  }
}

inspectTemplates().catch(console.error)
