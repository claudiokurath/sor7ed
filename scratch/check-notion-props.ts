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

async function check() {
  const env = loadEnvironment()
  const notion = new Client({ auth: env.NOTION_API_KEY })
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
    page_size: 1,
  })
  const page = response.results[0];
  if (!page) {
    console.log("No pages found in tools DB");
    return;
  }
  const propList = Object.entries(page.properties).map(([k, v]: [string, any]) => `${k} (${v.type})`);
  console.log("Page properties with types:\n", propList.join("\n"));
  
  // Also log the "Template" property specifically to see its text format
  if (page.properties.Template) {
    console.log("\nTemplate property content (raw):", JSON.stringify(page.properties.Template, null, 2));
  }
}

check().catch(console.error)
