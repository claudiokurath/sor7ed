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

async function checkDatabaseBrackets(dbId: string, name: string) {
  try {
    console.log(`\nChecking database "${name}" (${dbId})...`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let found = 0;

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: dbId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const page of response.results) {
        const title = page.properties?.['Song Title']?.title?.[0]?.plain_text || 
                      page.properties?.['Title']?.title?.[0]?.plain_text || 
                      "Untitled";
        
        const lyricsProp = page.properties?.Lyrics?.rich_text;
        const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";
        
        const matches = lyricsText.match(/\[[^\]]*(?:german|deutsch)[^\]]*\]/gi);
        if (matches) {
          found++;
          console.log(`- Song "${title}" (ID: ${page.id}) matches:`, matches);
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }
    console.log(`Done. Found ${found} songs with German/Deutsch brackets.`);
  } catch (error: any) {
    console.error(`Error checking database "${name}":`, error.message);
  }
}

async function main() {
  // Check the old database first
  await checkDatabaseBrackets('2780d601-4acc-8064-a87e-edc5e96fe22e', 'SONGS OLD');
  // Check the new database
  await checkDatabaseBrackets('3870d6014acc80088479f4df8e7283fe', 'SONGS NEW');
}

main().catch(console.error);
