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

async function translateGermanToEnglish(text: string): Promise<string> {
  if (!text.trim()) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translate API error: ${response.statusText}`);
    }
    const data = await response.json();
    const translatedSegments = data[0].map((segment: any) => segment[0]);
    return translatedSegments.join('');
  } catch (error: any) {
    console.error("Translation error for text:", text, error);
    throw error;
  }
}

interface Section {
  header: string;
  lines: string[];
  isGerman: boolean;
}

function parseLyrics(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  let currentSection: Section = { header: '', lines: [], isGerman: false };

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      if (currentSection.header || currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      let header = trimmed;
      let isGerman = false;
      
      // Check and update headers
      if (header === '[FAST AGGRESSIVE RAP, FEMALE VOCALS]') {
        header = '[FAST AGGRESSIVE RAP, VOCALS]';
        isGerman = true;
      } else if (header === '[ENGLISH FEMALE ECHO]') {
        header = '[ENGLISH ECHO]';
      } else if (header === '[GERMAN VERSE]') {
        header = '[GERMAN VERSE]'; // we can map it to GERMAN VERSE, but in English Lyrics we'll change it
        isGerman = true;
      }
      
      currentSection = {
        header,
        lines: [],
        isGerman
      };
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection.header || currentSection.lines.length > 0) {
    sections.push(currentSection);
  }
  return sections;
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
  const dryRun = !args.includes('--live');

  console.log(`\n==================================================`);
  console.log(`Notion Database Update: SONGS NEW`);
  console.log(`Database ID: ${databaseId}`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN (No changes will be saved)' : 'LIVE (Changes will be saved)'}`);
  console.log(`==================================================\n`);

  try {
    console.log(`[Query] Fetching all pages from SONGS NEW...`);
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

    let totalUpdated = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const title = page.properties?.['Song Title']?.title?.[0]?.plain_text || 
                    page.properties?.['Title']?.title?.[0]?.plain_text || 
                    "Untitled";

      const lyricsProp = page.properties?.Lyrics?.rich_text;
      const originalLyrics = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";

      const englishLyricsProp = page.properties?.['English Lyrics']?.rich_text;
      const originalEnglishLyrics = englishLyricsProp?.map((rt: any) => rt.plain_text).join('') || "";

      // 1. Parse original lyrics and update headers
      const parsedOriginal = parseLyrics(originalLyrics);
      const updatedLyrics = parsedOriginal.map(s => {
        const parts = [];
        if (s.header) parts.push(s.header);
        parts.push(...s.lines);
        return parts.join('\n');
      }).join('\n');

      // 2. Build/Update English lyrics
      let updatedEnglishLyrics = "";
      let didTranslate = false;

      if (originalEnglishLyrics.trim().length > 0) {
        // If English lyrics already exists, just parse it and update its headers (remove female)
        const parsedEnglish = parseLyrics(originalEnglishLyrics);
        updatedEnglishLyrics = parsedEnglish.map(s => {
          const parts = [];
          if (s.header) parts.push(s.header);
          parts.push(...s.lines);
          return parts.join('\n');
        }).join('\n');
      } else {
        // If English lyrics is empty, translate German parts and build it
        const parsedEnglishSections: Section[] = [];
        for (const s of parsedOriginal) {
          if (s.isGerman) {
            const germanText = s.lines.join('\n');
            if (germanText.trim()) {
              console.log(`  [Translate] Translating German part for "${title}"...`);
              const translatedText = await translateGermanToEnglish(germanText);
              
              let header = s.header;
              if (header === '[GERMAN VERSE]') {
                header = '[GERMAN VERSE — ENGLISH]';
              }
              
              parsedEnglishSections.push({
                header,
                lines: translatedText.split('\n'),
                isGerman: false
              });
              didTranslate = true;
            } else {
              parsedEnglishSections.push({
                header: s.header,
                lines: s.lines,
                isGerman: false
              });
            }
          } else {
            parsedEnglishSections.push({
              header: s.header,
              lines: s.lines,
              isGerman: false
            });
          }
        }
        updatedEnglishLyrics = parsedEnglishSections.map(s => {
          const parts = [];
          if (s.header) parts.push(s.header);
          parts.push(...s.lines);
          return parts.join('\n');
        }).join('\n');
      }

      const lyricsChanged = originalLyrics !== updatedLyrics;
      const englishLyricsChanged = originalEnglishLyrics !== updatedEnglishLyrics;

      if (lyricsChanged || englishLyricsChanged) {
        totalUpdated++;
        console.log(`\n[${totalUpdated}] Song: "${title}" (ID: ${page.id})`);
        if (lyricsChanged) {
          console.log(`  - Original Lyrics updated (removed female from tags).`);
        }
        if (englishLyricsChanged) {
          if (didTranslate) {
            console.log(`  - English Lyrics populated with translated German parts.`);
            // Print a sample of the translation
            const origGerman = parsedOriginal.find(s => s.isGerman)?.lines.slice(0, 2).join('\n') || "";
            const newEnglish = parsedOriginal.find(s => s.isGerman) ? updatedEnglishLyrics.match(/\[FAST AGGRESSIVE RAP, VOCALS\]\n([^\n]+)\n([^\n]+)/) : null;
            if (origGerman) {
              console.log(`    Sample:`);
              console.log(`      DE: ${origGerman.replace(/\n/g, ' / ')}`);
              if (newEnglish) {
                console.log(`      EN: ${newEnglish[1]} / ${newEnglish[2]}`);
              }
            }
          } else {
            console.log(`  - English Lyrics updated (removed female from tags).`);
          }
        }

        if (!dryRun) {
          const updatePayload: any = {
            page_id: page.id,
            properties: {}
          };

          if (lyricsChanged) {
            updatePayload.properties.Lyrics = {
              rich_text: chunkText(updatedLyrics, 1950)
            };
          }

          if (englishLyricsChanged) {
            updatePayload.properties['English Lyrics'] = {
              rich_text: chunkText(updatedEnglishLyrics, 1950)
            };
          }

          await notion.pages.update(updatePayload);
          console.log(`  ✅ Successfully updated in Notion.`);
          
          // Delay 350ms to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      }
    }

    console.log(`\n==================================================`);
    console.log(`Summary:`);
    console.log(`Total pages updated/to update: ${totalUpdated}`);
    console.log(`==================================================\n`);

  } catch (error: any) {
    console.error("❌ Error during processing:", error);
  }
}

main().catch(console.error);
