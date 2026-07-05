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

async function main() {
  try {
    console.log("Retrieving database properties for database ID:", databaseId);
    const database = await notion.databases.retrieve({ database_id: databaseId });
    console.log("Database Title:", database.title.map((t: any) => t.plain_text).join(''));
    console.log("Properties:");
    console.log(JSON.stringify(database.properties, null, 2));
  } catch (error: any) {
    console.error("Error retrieving database:", error.message);
  }
}

main().catch(console.error);
