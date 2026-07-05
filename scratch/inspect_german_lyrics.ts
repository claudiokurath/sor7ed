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
    console.log(`Querying database to search for German lyrics...`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let total = 0;
    let matchCount = 0;

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const page of response.results) {
        const title = page.properties?.['Song Title']?.title?.[0]?.plain_text || 
                      page.properties?.['Title']?.title?.[0]?.plain_text || 
                      "Untitled";
        
        // Retrieve block children (lyrics is in page properties or page body? Let's check both!)
        // Wait, the property Name in Notion is 'Lyrics' which is a rich text field. Let's inspect it!
        const lyricsProp = page.properties?.Lyrics?.rich_text;
        const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";
        
        if (lyricsText.toLowerCase().includes('german') || 
            lyricsText.toLowerCase().includes('deutsch') ||
            lyricsText.includes('[GERMAN') ||
            lyricsText.includes('[German')) {
          
          matchCount++;
          console.log(`\n--------------------------------------------`);
          console.log(`${matchCount}. Song: "${title}" (ID: ${page.id})`);
          
          // Print lines around the German tag
          const lines = lyricsText.split('\n');
          lines.forEach((line: string, idx: number) => {
            if (line.includes('GERMAN') || line.includes('German') || line.includes('Deutsch') || line.includes('german')) {
              console.log(`Line ${idx}: ${line}`);
              // Print next 5 lines
              for (let j = 1; j <= 6; j++) {
                if (lines[idx + j] !== undefined) {
                  console.log(`Line ${idx + j}: ${lines[idx + j]}`);
                }
              }
            }
          });
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`\nSearch complete. Found ${matchCount} songs with German lyrics/references.`);

  } catch (error: any) {
    console.error("❌ Error querying Notion:", error.message);
  }
}

main().catch(console.error);
