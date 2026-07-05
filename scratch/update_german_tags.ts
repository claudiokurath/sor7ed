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

// Target replacement tag: fast, aggressive rap
const NEW_TAG = '[GERMAN RAP — FAST, AGGRESSIVE]';

function chunkText(text: string, limit = 2000): Array<{ type: 'text'; text: { content: string } }> {
  const chunks: Array<{ type: 'text'; text: { content: string } }> = [];
  for (let i = 0; i < text.length; i += limit) {
    chunks.push({
      type: 'text',
      text: {
        content: text.substring(i, i + limit)
      }
    });
  }
  return chunks;
}

async function main() {
  try {
    console.log(`Starting Notion database update for German lyric style tags...`);
    console.log(`Target tag: "${NEW_TAG}"`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let totalUpdated = 0;

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
        
        // Match tags like [...] containing GERMAN, German, german, DEUTSCH, Deutsch, deutsch
        const regex = /\[[^\]]*(?:german|deutsch)[^\]]*\]/gi;
        
        if (regex.test(lyricsText)) {
          const updatedLyrics = lyricsText.replace(regex, NEW_TAG);
          const textChunks = chunkText(updatedLyrics, 1950); // safety margin
          
          console.log(`Updating "${title}" (ID: ${page.id})...`);
          
          // Update the Lyrics property on the page
          await notion.pages.update({
            page_id: page.id,
            properties: {
              Lyrics: {
                rich_text: textChunks
              },
            },
          });
          
          totalUpdated++;
          console.log(`✅ Updated successfully!`);
          
          // Wait 350ms between requests to respect Notion rate limits
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`\nUpdate finished! Successfully updated ${totalUpdated} songs in Notion.`);

  } catch (error: any) {
    console.error("❌ Error during update:", error.message);
  }
}

main().catch(console.error);
