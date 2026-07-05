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
const databaseId = '3870d6014acc80088479f4df8e7283fe';

const STYLES = [
  'Intimate / Contemplative',
  'Nuclear / Maximum impact',
  'Confident / Upbeat',
  'Warm / Building',
  'Aggressive / Confrontational'
];

const TARGET_GERMAN_TAG = '[FAST AGGRESSIVE RAP, FEMALE VOCALS]';

function determineStyle(vibes: string[]): string {
  const v = vibes.map(x => x.toLowerCase());

  // 1. Nuclear / Maximum impact (Intense / Dark / Anger/Defiance)
  if (v.includes('intense') || v.includes('dark')) {
    return 'Nuclear / Maximum impact';
  }

  // 2. Aggressive / Confrontational
  if (v.includes('anger/defiance') || v.includes('anger') || v.includes('defiance')) {
    return 'Aggressive / Confrontational';
  }

  // 3. Confident / Upbeat
  if (v.includes('empowerment') || v.includes('self-worth/identity') || v.includes('confident') || v.includes('joyful') || v.includes('uplifting') || v.includes('energetic')) {
    return 'Confident / Upbeat';
  }

  // 4. Warm / Building
  if (v.includes('growth/healing') || v.includes('resilience') || v.includes('healing') || v.includes('growth')) {
    return 'Warm / Building';
  }

  // 5. Intimate / Contemplative (Default fallback)
  return 'Intimate / Contemplative';
}

function chunkText(text: string, limit = 1950): Array<{ type: 'text'; text: { content: string } }> {
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
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log(`\n==================================================`);
  console.log(`Notion Database Migration: SONGS NEW`);
  console.log(`Database ID: ${databaseId}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN (No changes will be saved)' : 'LIVE (Changes will be saved)'}`);
  console.log(`==================================================\n`);

  try {
    // 1. Schema update
    if (!dryRun) {
      console.log(`[Schema] Ensuring select property "Style" exists with the 5 options...`);
      await notion.databases.update({
        database_id: databaseId,
        properties: {
          Style: {
            select: {
              options: [
                { name: 'Intimate / Contemplative', color: 'blue' },
                { name: 'Nuclear / Maximum impact', color: 'red' },
                { name: 'Confident / Upbeat', color: 'yellow' },
                { name: 'Warm / Building', color: 'orange' },
                { name: 'Aggressive / Confrontational', color: 'purple' }
              ]
            }
          }
        }
      });
      console.log(`[Schema] ✅ Database property "Style" is configured.`);
    } else {
      console.log(`[Schema] [Dry-run] Would update database schema to add select property "Style" with the 5 options.`);
    }

    // 2. Query pages
    console.log(`\n[Query] Fetching all pages from the new database...`);
    let hasMore = true;
    let cursor: string | undefined = undefined;
    let pages: any[] = [];

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });
      pages.push(...response.results);
      hasMore = response.has_more;
      cursor = response.next_cursor;
    }
    console.log(`[Query] Fetched ${pages.length} pages total.`);

    // 3. Process pages
    let totalUpdated = 0;
    let totalGermanTagsReplaced = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const title = page.properties?.['Song Title']?.title?.[0]?.plain_text || 
                    page.properties?.['Title']?.title?.[0]?.plain_text || 
                    "Untitled";

      const lyricsProp = page.properties?.Lyrics?.rich_text;
      const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";

      // Extract vibes from multi-select
      const multiSelectVibes = page.properties?.['Multi-select']?.multi_select?.map((s: any) => s.name) || [];
      const emotionVibe = page.properties?.['Emotion&Vibe']?.multi_select?.map((s: any) => s.name) || [];
      const vibes = [...new Set([...multiSelectVibes, ...emotionVibe])];

      const currentStyle = page.properties?.Style?.select?.name || null;
      const targetStyle = determineStyle(vibes);

      // Match German lyrics brackets
      const regex = /\[[^\]]*(?:german|deutsch|female\s+vocals|aggressive\s+rap)[^\]]*\]/gi;
      const hasGermanTag = regex.test(lyricsText);
      const updatedLyrics = lyricsText.replace(regex, TARGET_GERMAN_TAG);

      const lyricsChanged = lyricsText !== updatedLyrics;
      const styleChanged = currentStyle !== targetStyle;

      if (lyricsChanged || styleChanged) {
        totalUpdated++;
        console.log(`\n[${i + 1}/${pages.length}] Song: "${title}" (ID: ${page.id})`);
        console.log(`  - Vibes: [${vibes.join(', ')}]`);
        
        if (styleChanged) {
          console.log(`  - Style: "${currentStyle || 'None'}" -> "${targetStyle}"`);
        } else {
          console.log(`  - Style: Already set to "${targetStyle}"`);
        }

        if (lyricsChanged) {
          totalGermanTagsReplaced++;
          const matches = lyricsText.match(regex) || [];
          console.log(`  - Lyrics Brackets updated: ${JSON.stringify(matches)} -> "${TARGET_GERMAN_TAG}"`);
        }

        if (!dryRun) {
          const updatePayload: any = {
            page_id: page.id,
            properties: {
              Style: {
                select: { name: targetStyle }
              }
            }
          };

          if (lyricsChanged) {
            updatePayload.properties.Lyrics = {
              rich_text: chunkText(updatedLyrics, 1950)
            };
          }

          await notion.pages.update(updatePayload);
          console.log(`  ✅ Successfully updated in Notion.`);
          
          // Delay 350ms to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 350));
        } else {
          console.log(`  [Dry-run] Would save changes to Notion.`);
        }
      }
    }

    console.log(`\n==================================================`);
    console.log(`Migration Summary:`);
    console.log(`Total songs processed: ${pages.length}`);
    console.log(`Total songs requiring update: ${totalUpdated}`);
    console.log(`Total songs with German tags replaced: ${totalGermanTagsReplaced}`);
    console.log(`==================================================\n`);

  } catch (error: any) {
    console.error(`\n❌ Error during migration:`, error.message);
  }
}

main().catch(console.error);
