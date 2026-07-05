import { Client } from '@notionhq/client';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

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
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const STORAGE_BUCKET = 'notion-files';

async function uploadAndSetCover(slug: string, sourcePath: string) {
  console.log(`[Upload] Reading cover file for ${slug}: ${sourcePath}`);
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`File does not exist: ${sourcePath}`);
  }
  
  const buffer = fs.readFileSync(sourcePath);
  const storagePath = `covers/${slug}.png`;
  
  // Upload to Supabase Storage
  console.log(`[Upload] Uploading ${storagePath} to Supabase...`);
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }
  
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;
  console.log(`[Upload] Public URL: ${publicUrl}`);
  
  // Query Notion for the page with this slug
  console.log(`[Upload] Querying Notion for page with slug: ${slug}`);
  const response = await notion.databases.query({
    database_id: env.NOTION_BLOG_DB_ID,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    }
  });
  
  if (response.results.length === 0) {
    throw new Error(`No page found in Notion with slug: ${slug}`);
  }
  
  const pageId = response.results[0].id;
  console.log(`[Upload] Found Notion page ID: ${pageId}. Updating Cover Image 1...`);
  
  await notion.pages.update({
    page_id: pageId,
    properties: {
      'Cover Image 1': {
        files: [
          {
            name: `${slug}-custom-cover`,
            type: 'external',
            external: {
              url: publicUrl
            }
          }
        ]
      }
    }
  });
  
  console.log(`[Upload] Successfully updated Notion page for ${slug}!`);
}

async function main() {
  const artifactDir = '/Users/claudiokurath/.gemini/antigravity-ide/brain/a2858709-cbed-4d06-97f6-23f9bd9325a1';
  
  const covers = [
    {
      slug: 'people-pleasing-fear-not-kindness',
      filename: 'people_pleasing_quirky_1783276132820.png'
    },
    {
      slug: 'where-adhd-tax-actually-hides',
      filename: 'adhd_tax_quirky_1783276147231.png'
    }
  ];
  
  for (const cover of covers) {
    const fullPath = path.join(artifactDir, cover.filename);
    try {
      await uploadAndSetCover(cover.slug, fullPath);
    } catch (err: any) {
      console.error(`Error processing ${cover.slug}:`, err.message || err);
    }
  }
}

main().catch(console.error);
