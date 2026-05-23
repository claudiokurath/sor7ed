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

async function inspectLiveTools() {
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
    filter: {
      property: 'Status',
      status: {
        does_not_equal: 'Draft'
      }
    }
  })

  console.log(`Found ${response.results.length} live tools in Notion:`);
  for (const page of response.results as any[]) {
    const name = getText(page.properties.Name);
    const slug = getText(page.properties.Slug);
    const template = getText(page.properties.Template);
    console.log(`\n========================================`);
    console.log(`Tool: "${name}" (${slug})`);
    console.log(`Template:`);
    console.log(template);
  }
}

inspectLiveTools().catch(console.error)
