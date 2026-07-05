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

  console.log(`Searching for keywords...`);
  const matches = pages.map(page => {
    const title = page.properties.Title?.title?.[0]?.plain_text || '';
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';
    const status = page.properties.Status?.status?.name || page.properties.Status?.select?.name || '';
    const id = page.id;
    return { id, title, slug, status };
  });

  const filtered = matches.filter(m => 
    /tax|hide|actually|invisible|debt/i.test(m.title) || 
    /tax|hide|actually|invisible|debt/i.test(m.slug)
  );

  console.log('Filtered matching articles:');
  console.log(filtered);
}

main().catch(console.error);
