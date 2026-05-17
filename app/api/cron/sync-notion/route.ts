import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const NOTION_DB_ID = process.env.NOTION_BLOG_DB_ID!;
const STORAGE_BUCKET = 'notion-files';
const STORAGE_PREFIX = 'covers';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---- Notion property extractors ----

type RichTextItem = { text: { content: string } };
type NotionFile =
  | { type: 'file'; file: { url: string } }
  | { type: 'external'; external: { url: string } };
type NotionProp =
  | { type: 'title'; title: RichTextItem[] }
  | { type: 'rich_text'; rich_text: RichTextItem[] }
  | { type: 'select'; select: { name: string } | null }
  | { type: 'status'; status: { name: string } | null }
  | { type: 'files'; files: NotionFile[] }
  | { type: 'date'; date: { start: string } | null };

function text(p: NotionProp | undefined): string {
  if (!p) return '';
  if (p.type === 'title') return p.title.map(t => t.text.content).join('');
  if (p.type === 'rich_text') return p.rich_text.map(t => t.text.content).join('');
  return '';
}

function select(p: NotionProp | undefined): string {
  if (!p || p.type !== 'select') return '';
  return p.select?.name ?? '';
}

function status(p: NotionProp | undefined): string {
  if (!p || p.type !== 'status') return '';
  return p.status?.name ?? '';
}

function notionFile(p: NotionProp | undefined): { url: string; isHosted: boolean } | null {
  if (!p || p.type !== 'files' || p.files.length === 0) return null;
  const f = p.files[0];
  if (f.type === 'file') return { url: f.file.url, isHosted: true };
  if (f.type === 'external') return { url: f.external.url, isHosted: false };
  return null;
}

// ---- Cover image: download from Notion → upload to Supabase Storage ----

async function persistCoverImage(slug: string, notionUrl: string): Promise<string> {
  const supabase = getSupabase();
  const storagePath = `${STORAGE_PREFIX}/${slug}.jpg`;

  // Skip re-upload if already stored (check by path existence)
  const { data: existing } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(STORAGE_PREFIX, { search: `${slug}.jpg` });

  if (existing && existing.length > 0) {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  // Download from Notion
  const imgRes = await fetch(notionUrl);
  if (!imgRes.ok) return notionUrl; // fallback to temp URL

  const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${STORAGE_PREFIX}/${slug}.${ext}`;
  const buffer = await imgRes.arrayBuffer();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    console.error(`[sync-notion] Storage upload failed for ${slug}:`, error.message);
    return notionUrl; // fallback
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---- Sync handler ----

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all Published pages from Notion, paginating if needed
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Status', status: { equals: 'Published' } },
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
    });

    if (!res.ok) {
      console.error('Notion error:', await res.text());
      return NextResponse.json({ error: 'Notion API failed' }, { status: 500 });
    }

    const json = await res.json() as {
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    };
    pages.push(...json.results);
    cursor = json.has_more && json.next_cursor ? json.next_cursor : undefined;
  } while (cursor);

  // Map Notion pages → Supabase rows (with cover image persistence)
  const rows = await Promise.all(
    pages
      .map(page => {
        const p = page.properties as Record<string, NotionProp>;
        return { page, p, slug: text(p['Title'] ? undefined : undefined) || text(p['Slug']) };
      })
      .filter(({ p }) => text(p['Slug']).length > 0)
      .map(async ({ p }) => {
        const slug = text(p['Slug']);
        const file = notionFile(p['Cover Image 1']);

        let cover_image = '';
        if (file) {
          // Notion-hosted files: download once, store permanently in Supabase Storage
          cover_image = file.isHosted
            ? await persistCoverImage(slug, file.url)
            : file.url; // external URLs used as-is
        }

        return {
          title: text(p['Title']),
          slug,
          branch: select(p['Branch']),
          status: status(p['Status']),
          summary: text(p['Summary']),
          excerpt: text(p['Excerpt']),
          problem: text(p['Blog Post']),
          cta: text(p['CTA']),
          protocol: text(p['Protocol']),
          keyword: text(p['WhatsApp Trigger']),
          cover_image,
          read_time: text(p['Read Time']),
          meta_description: text(p['Meta Description']),
          seo_title: text(p['SEO Title']),
        };
      })
  );

  if (rows.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  const { error } = await getSupabase()
    .from('protocols')
    .upsert(rows, { onConflict: 'slug' });

  if (error) {
    console.error('Supabase upsert error:', error);
    return NextResponse.json({ error: 'Upsert failed', detail: error.message }, { status: 500 });
  }

  console.log(`[sync-notion] Synced ${rows.length} protocols`);
  return NextResponse.json({ synced: rows.length, slugs: rows.map(r => r.slug) });
}

type NotionPage = { id: string; properties: Record<string, unknown> };
