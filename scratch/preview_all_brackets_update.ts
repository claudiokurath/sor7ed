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

function replaceTags(text: string): { updatedText: string; log: string[] } {
  const log: string[] = [];
  const lines = text.split('\n');
  const updatedLines = lines.map(line => {
    const trimmed = line.trim();
    // Only match tags that occupy their own line or match bracketed structure
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Skip German rap tags which we updated earlier
      if (trimmed.includes('GERMAN RAP — FAST, AGGRESSIVE')) {
        return line;
      }
      
      let newTag = trimmed;
      if (/^\[INTRO/i.test(trimmed)) {
        newTag = '[INTRO — Piano Melody, Cinematic Strings, 85 BPM]';
      } else if (/^\[VERSE\s*(\d+)/i.test(trimmed)) {
        const num = trimmed.match(/\d+/)?.[0];
        newTag = `[VERSE ${num} — Melancholic Rap, Piano Melody, 85 BPM, Emotional]`;
      } else if (/^\[VERSE/i.test(trimmed)) {
        newTag = '[VERSE — Melancholic Rap, Piano Melody, 85 BPM, Emotional]';
      } else if (/^\[PRE-CHORUS/i.test(trimmed) || /^\[PRE-HOOK/i.test(trimmed)) {
        newTag = '[PRE-CHORUS — Synth Buildup, Cinematic Strings, Rising Intensity]';
      } else if (/^\[CHORUS/i.test(trimmed) || /^\[HOOK/i.test(trimmed)) {
        newTag = '[CHORUS — Powerful Chorus, Euphoric Drop, Emotional]';
      } else if (/^\[BRIDGE/i.test(trimmed)) {
        newTag = '[BRIDGE — Emotional, Cinematic Strings, Piano]';
      } else if (/^\[OUTRO/i.test(trimmed)) {
        newTag = '[OUTRO — Melancholic Rap, Piano Fadeout, Emotional]';
      }
      
      if (newTag !== trimmed) {
        log.push(`"${trimmed}" -> "${newTag}"`);
        return line.replace(trimmed, newTag);
      }
    }
    return line;
  });
  
  return { updatedText: updatedLines.join('\n'), log };
}

async function main() {
  try {
    console.log("Simulating lyric style tag replacements...\n");
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
        
        const { log } = replaceTags(lyricsText);
        if (log.length > 0) {
          matchCount++;
          console.log(`Song #${matchCount}: "${title}" (ID: ${page.id})`);
          log.forEach(msg => console.log(`  - ${msg}`));
          console.log('--------------------------------------------------');
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`Total songs to be updated: ${matchCount}`);

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
