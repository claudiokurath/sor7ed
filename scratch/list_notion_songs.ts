import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';

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
    console.log(`Querying database: ${databaseId} from local node_modules...`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let total = 0;
    const songs: any[] = [];

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });

      response.results.forEach((row: any) => {
        const title = row.properties?.['Song Title']?.title?.[0]?.plain_text || 
                      row.properties?.['Title']?.title?.[0]?.plain_text || 
                      "Untitled";
        const status = row.properties?.Status?.status?.name || "No Status";
        const emotionVibe = row.properties?.['Emotion&Vibe']?.multi_select?.map((s: any) => s.name).join(', ') || "";
        const genre = row.properties?.Genre?.multi_select?.map((s: any) => s.name).join(', ') || "";
        
        songs.push({ id: row.id, title, status, emotionVibe, genre });
      });

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`Total songs found: ${songs.length}`);
    songs.slice(0, 50).forEach((song, i) => {
      console.log(`${i+1}. [${song.status}] ${song.title} (Genre: ${song.genre} | Vibe: ${song.emotionVibe}) (ID: ${song.id})`);
    });
    if (songs.length > 50) {
      console.log(`... and ${songs.length - 50} more.`);
    }

  } catch (error: any) {
    console.error("❌ Error querying Notion:", error.message);
  }
}

main().catch(console.error);
