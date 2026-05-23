import { Client } from '@notionhq/client'
import * as fs from 'fs'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach(line => {
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

const getText = (prop: any): string => {
  if (!prop) return '';
  if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text).join('');
  if (prop.title) return prop.title.map((t: any) => t.plain_text).join('');
  return '';
};

const getStatus = (prop: any): string => {
  if (!prop) return '';
  return prop.status?.name || '';
};

async function main() {
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
  })
  console.log('Tools in Notion:')
  const results = response.results.map((page: any) => {
    return {
      name: getText(page.properties.Name),
      slug: getText(page.properties.Slug),
      status: getStatus(page.properties.Status)
    }
  })
  console.log(JSON.stringify(results, null, 2))
}

main().catch(console.error)
