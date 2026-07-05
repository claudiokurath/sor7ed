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
const pageId = '30b0d601-4acc-81ac-9b7f-cc93255996a2'; // THE INVISIBLE ADHD TAX page ID

async function main() {
  console.log(`Updating Notion page ${pageId}...`);
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Slug: {
          rich_text: [
            {
              text: {
                content: 'where-adhd-tax-actually-hides',
              },
            },
          ],
        },
        Status: {
          status: {
            name: 'Published',
          },
        },
      },
    });
    console.log('Successfully updated Notion page:', response.id);
  } catch (error: any) {
    console.error('Failed to update Notion page:', error.message);
  }
}

main().catch(console.error);
