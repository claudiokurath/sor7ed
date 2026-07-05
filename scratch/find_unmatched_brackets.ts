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
const databaseId = '2780d601-4acc-8064-a87e-edc5e96fe22e';

async function main() {
  try {
    let hasMore = true;
    let cursor: string | undefined = undefined;
    const unmatched = new Set<string>();

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const page of response.results) {
        const title = page.properties?.Title?.title?.[0]?.plain_text || page.properties?.['Song Title']?.rich_text?.[0]?.plain_text || 'Untitled';
        const lyricsProp = page.properties?.Lyrics?.rich_text;
        const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";
        
        const lines = lyricsText.split('\n');
        for (const line of lines) {
          const matches = line.match(/\[[^\]]+\]/g);
          if (matches) {
            for (const m of matches) {
              if (/(INTRO|VERSE|CHORUS|HOOK|BRIDGE|OUTRO|PRE-CHORUS|PRE-HOOK)/i.test(m) && !m.includes(' — ') && !m.includes('GERMAN RAP')) {
                unmatched.add(`${title}: ${m} (Full line: "${line}")`);
              }
            }
          }
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log("Unmatched brackets:");
    Array.from(unmatched).sort().forEach(tag => console.log(tag));

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
