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

function cleanGenre(genre: string): string {
  const g = genre.trim();
  if (g.includes('Singer-Songwriter / Indie Folk')) return 'Indie Folk';
  if (g.includes('House / EDM')) return 'Progressive House';
  if (g.includes('Hip-Hop / Rap')) return 'Melancholy Rap';
  if (g.includes('Alt Pop / Indie Pop')) return 'Alt Pop';
  if (g.includes('Pop Rock / Alt Rock')) return 'Alt Rock';
  if (g.includes('Electronic / Electropop')) return 'Electropop';
  if (g.includes('Ambient / Cinematic')) return 'Cinematic';
  return g;
}

function getUniqueTags(text: string, genres: string[], vibes: string[]): { updatedText: string; log: string[] } {
  const log: string[] = [];
  const lines = text.split('\n');
  
  // Clean genres and select top 2
  const cleanGenres = genres.map(cleanGenre).slice(0, 2);
  const selectedVibes = vibes.slice(0, 2);
  
  const genreStr = cleanGenres.join(', ') || 'Melancholy Rap';
  const vibeStr = selectedVibes.join(', ') || 'Emotional';
  
  const updatedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Skip German rap tags which are already set
      if (trimmed.includes('GERMAN RAP — FAST, AGGRESSIVE')) {
        return line;
      }
      
      let newTag = trimmed;
      if (/^\[INTRO/i.test(trimmed)) {
        newTag = `[INTRO — Piano Melody, Cinematic Strings, ${vibeStr}, 85 BPM]`;
      } else if (/^\[VERSE\s*(\d+)/i.test(trimmed)) {
        const num = trimmed.match(/\d+/)?.[0];
        newTag = `[VERSE ${num} — ${genreStr}, Piano Melody, 85 BPM, ${vibeStr}]`;
      } else if (/^\[VERSE/i.test(trimmed)) {
        newTag = `[VERSE — ${genreStr}, Piano Melody, 85 BPM, ${vibeStr}]`;
      } else if (/^\[PRE-CHORUS/i.test(trimmed) || /^\[PRE-HOOK/i.test(trimmed)) {
        newTag = `[PRE-CHORUS — Synth Buildup, Cinematic Strings, ${selectedVibes[0] || 'Emotional'}, Rising Intensity]`;
      } else if (/^\[CHORUS/i.test(trimmed) || /^\[HOOK/i.test(trimmed)) {
        newTag = `[CHORUS — Powerful Chorus, Euphoric Drop, ${cleanGenres[0] || 'Hip Hop'}, ${vibeStr}]`;
      } else if (/^\[BRIDGE/i.test(trimmed)) {
        newTag = `[BRIDGE — ${vibeStr}, Cinematic Strings, Piano]`;
      } else if (/^\[OUTRO/i.test(trimmed)) {
        newTag = `[OUTRO — ${cleanGenres[0] || 'Melancholy Rap'}, Piano Fadeout, ${selectedVibes[0] || 'Reflective'}]`;
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
    console.log("Simulating dynamic, song-specific style tag replacements...\n");
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
        
        const genres = page.properties?.Genre?.multi_select?.map((s: any) => s.name) || [];
        const vibes = page.properties?.['Emotion&Vibe']?.multi_select?.map((s: any) => s.name) || [];
        
        const { log } = getUniqueTags(lyricsText, genres, vibes);
        if (log.length > 0) {
          matchCount++;
          console.log(`Song #${matchCount}: "${title}"`);
          console.log(`  - Genres: ${genres.join(', ')} | Vibes: ${vibes.join(', ')}`);
          log.slice(0, 8).forEach(msg => console.log(`    * ${msg}`));
          if (log.length > 8) console.log(`    * ... and ${log.length - 8} more tags.`);
          console.log('--------------------------------------------------');
        }
      }

      hasMore = response.has_more;
      cursor = response.next_cursor;
    }

    console.log(`Total songs with tags to be customized: ${matchCount}`);

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main().catch(console.error);
