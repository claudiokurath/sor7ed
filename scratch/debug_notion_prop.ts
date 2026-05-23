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

async function main() {
  const response = await notion.databases.query({
    database_id: env.NOTION_BLOG_DB_ID,
    page_size: 3
  })

  for (const page of response.results as any[]) {
    console.log(`PAGE: ${page.id} - ${page.properties.Title?.title?.[0]?.plain_text}`);
    const blogPostProp = page.properties['Blog Post'];
    console.log(`Type: ${blogPostProp?.type}`);
    if (blogPostProp?.rich_text) {
      console.log(`Rich text segments count: ${blogPostProp.rich_text.length}`);
      blogPostProp.rich_text.forEach((rt: any, idx: number) => {
        console.log(`Segment ${idx}: text="${JSON.stringify(rt.plain_text)}", href=${rt.href}, annotations=${JSON.stringify(rt.annotations)}`);
      });
    }
    console.log('--------------------------------------------------\n');
  }
}

main().catch(console.error);
