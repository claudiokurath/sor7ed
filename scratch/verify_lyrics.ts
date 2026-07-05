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
const songPageId = '5ba0d601-4acc-8315-8de3-8109c98fc11d'; // I Am the Proof

async function main() {
  try {
    const page: any = await notion.pages.retrieve({ page_id: songPageId });
    const title = page.properties?.['Song Title']?.title?.[0]?.plain_text || "Untitled";
    const lyricsProp = page.properties?.Lyrics?.rich_text;
    const lyricsText = lyricsProp?.map((rt: any) => rt.plain_text).join('') || "";

    console.log(`Verification for Song: "${title}"`);
    console.log(`Number of text blocks returned: ${lyricsProp?.length}`);
    console.log(`Lyrics Content:\n`);
    console.log(lyricsText);
  } catch (error: any) {
    console.error("Error retrieving page:", error.message);
  }
}

main().catch(console.error);
