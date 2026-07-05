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

// Target replacement tag as requested: always too fast, aggressive, rap, female vocals
const NEW_TAG = '[GERMAN RAP — FEMALE VOCALS, FAST, AGGRESSIVE]';

async function main() {
  try {
    console.log(`Previewing proposed tag changes to NEW_TAG: "${NEW_TAG}"...\n`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
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
        
        const lyricsProp = page.properties?.Lyrics?.rich_text;
        const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";
        
        // Find tags like [...] containing GERMAN, German, german, DEUTSCH, Deutsch, deutsch
        const regex = /\[[^\]]*(?:german|deutsch)[^\]]*\]/gi;
        const matches = lyricsText.match(regex);
        
        if (matches) {
          matchCount++;
          console.log(`Song #${matchCount}: "${title}" (ID: ${page.id})`);
          matches.forEach((m: string) => {
            console.log(`  - Match: "${m}" -> "${NEW_TAG}"`);
          });
          
          // Let's show a preview of how the lyrics would look with replacement
          const replacedLyrics = lyricsText.replace(regex, NEW_TAG);
          // Get the lines containing the new tag to show context
          const lines = replacedLyrics.split('\n');
          lines.forEach((line: string, idx: number) => {
            if (line === NEW_TAG) {
              console.log(`  - Preview context:`);
              console.log(`    Line ${idx}:   ${line}`);
              if (lines[idx + 1]) console.log(`    Line ${idx + 1}: ${lines[idx + 1]}`);
              if (lines[idx + 2]) console.log(`    Line ${idx + 2}: ${lines[idx + 2]}`);
            }
          });
          console.log('--------------------------------------------------');
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`Total songs with matching German tags: ${matchCount}`);

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
