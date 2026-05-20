#!/usr/bin/env node
// One-time script to download all cover images from Notion and persist to Supabase Storage.
// Run: node scripts/persist-covers.mjs

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1')];
    })
);

const SUPABASE_URL     = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const NOTION_API_KEY   = env.NOTION_API_KEY;
const PROTOCOLS_DB_ID  = env.NOTION_BLOG_DB_ID;
const TOOLS_DB_ID      = env.NOTION_TOOLS_DB_ID;
const BUCKET           = 'notion-files';
const PREFIX           = 'covers';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function notionQuery(dbId, filter) {
  const pages = [];
  let cursor;
  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filter, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new Error(`Notion error: ${await res.text()}`);
    const j = await res.json();
    pages.push(...j.results);
    cursor = j.has_more && j.next_cursor ? j.next_cursor : undefined;
  } while (cursor);
  return pages;
}

function getNotionFile(p, ...keys) {
  for (const key of keys) {
    const prop = p[key];
    if (!prop || prop.type !== 'files' || prop.files.length === 0) continue;
    const f = prop.files[0];
    if (f.type === 'file') return { url: f.file.url, isHosted: true };
    if (f.type === 'external') return { url: f.external.url, isHosted: false };
  }
  return null;
}

function getText(p, key) {
  const prop = p[key];
  if (!prop) return '';
  if (prop.type === 'title') return prop.title.map(t => t.text.content).join('');
  if (prop.type === 'rich_text') return prop.rich_text.map(t => t.text.content).join('');
  return '';
}

async function persistImage(slug, notionUrl) {
  // Check if already persisted
  const { data: existing } = await supabase.storage.from(BUCKET).list(PREFIX, { search: slug });
  if (existing?.length) {
    const match = existing.find(f => f.name.startsWith(slug + '.'));
    if (match) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${PREFIX}/${match.name}`);
      console.log(`  ↳ already stored: ${match.name}`);
      return data.publicUrl;
    }
  }

  const imgRes = await fetch(notionUrl, { headers: { 'User-Agent': 'SOR7ED-Sync/1.0' } });
  if (!imgRes.ok) {
    console.log(`  ✗ fetch ${imgRes.status} — skipping`);
    return null;
  }

  const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${PREFIX}/${slug}.${ext}`;
  const buffer = await imgRes.arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true });
  if (error) {
    console.log(`  ✗ upload failed: ${error.message}`);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  console.log(`  ✓ uploaded → ${data.publicUrl}`);
  return data.publicUrl;
}

async function run() {
  console.log('\n=== Persisting Protocol cover images ===');
  const pages = await notionQuery(PROTOCOLS_DB_ID, { property: 'Status', status: { equals: 'Published' } });
  console.log(`Found ${pages.length} published protocols\n`);

  for (const page of pages) {
    const p = page.properties;
    const slug = getText(p, 'Slug');
    if (!slug) continue;
    const file = getNotionFile(p, 'Cover Image 1', 'Cover Image');
    if (!file?.isHosted) {
      console.log(`[${slug}] no hosted image — skip`);
      continue;
    }
    console.log(`[${slug}]`);
    const url = await persistImage(slug, file.url);
    if (url) {
      await supabase.from('protocols').update({ cover_image: url }).eq('slug', slug);
    }
  }

  console.log('\n=== Persisting Tool cover images ===');
  const toolPages = await notionQuery(TOOLS_DB_ID, { property: 'Status', status: { does_not_equal: 'Draft' } });
  console.log(`Found ${toolPages.length} tools\n`);

  for (const page of toolPages) {
    const p = page.properties;
    const slug = getText(p, 'Slug');
    if (!slug) continue;
    const file = getNotionFile(p, 'Cover Image', 'Cover Image 1');
    if (!file?.isHosted) {
      console.log(`[${slug}] no hosted image — skip`);
      continue;
    }
    console.log(`[${slug}]`);
    const url = await persistImage(slug, file.url);
    if (url) {
      await supabase.from('tools').update({ cover_image: url }).eq('slug', slug);
    }
  }

  console.log('\n✅ Done.\n');
}

run().catch(err => { console.error(err); process.exit(1); });
