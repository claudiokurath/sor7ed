import { Client } from '@notionhq/client';
import * as fs from 'fs';

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const env: Record<string, string> = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) return;
    const key = trimmed.substring(0, equalIndex).trim();
    const value = trimmed.substring(equalIndex + 1).trim();
    if (key) env[key] = value;
  });
  return env;
}

const env = loadEnvironment();
const notion = new Client({ auth: env.NOTION_API_KEY });
const databaseId = env.NOTION_BLOG_DB_ID;

async function main() {
  console.log(`Querying Notion Blog DB: ${databaseId}...`);
  const pages: any[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...response.results);
    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  console.log(`Retrieved ${pages.length} total pages from Notion.`);
  
  const matches = pages.map(page => {
    const title = page.properties.Title?.title?.[0]?.plain_text || '';
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';
    const status = page.properties.Status?.status?.name || page.properties.Status?.select?.name || '';
    return { title, slug, status };
  });

  console.log('Sample Notion articles:');
  console.log(matches.slice(0, 30));

  console.log('Searching for "adhd-tax" in slugs:');
  const matching = matches.filter(m => m.slug.toLowerCase().includes('adhd-tax') || m.title.toLowerCase().includes('adhd tax'));
  console.log(matching);
}

main().catch(console.error);
