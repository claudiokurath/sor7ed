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
    if (key) {
      env[key] = value
    }
  })
  
  return env
}

const getText = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  const p = prop as { rich_text?: Array<{ plain_text: string }>; title?: Array<{ plain_text: string }> };
  if (p.rich_text) return p.rich_text.map(t => t.plain_text).join('');
  if (p.title) return p.title.map(t => t.plain_text).join('');
  return '';
};

function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  // Remove markdown block wraps if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '');
  } else if (cleaned.startsWith('json')) {
    cleaned = cleaned.substring(4).trim();
  }
  return cleaned;
}

async function check() {
  const env = loadEnvironment()
  const notion = new Client({ auth: env.NOTION_API_KEY })
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
    filter: {
      property: 'Status',
      status: {
        does_not_equal: 'Draft'
      }
    }
  })
  
  for (const page of response.results as any[]) {
    const name = getText(page.properties.Name);
    const slug = getText(page.properties.Slug);
    const templateText = getText(page.properties.Template);
    const cleaned = cleanJsonString(templateText);
    
    console.log(`\n========================================`);
    console.log(`Tool: ${name} (${slug})`);
    try {
      const parsed = JSON.parse(cleaned);
      console.log("Parsed keys:", Object.keys(parsed));
      if (parsed.fields) {
        console.log("Fields count:", parsed.fields.length);
        console.log("Fields sample:", JSON.stringify(parsed.fields, null, 2));
      } else {
        console.log("No fields array. Full template object:", JSON.stringify(parsed, null, 2));
      }
    } catch (e: any) {
      console.error(`Failed to parse template JSON for ${name}:`, e.message);
      console.log("Raw cleaned template string:", cleaned);
    }
  }
}

check().catch(console.error)
