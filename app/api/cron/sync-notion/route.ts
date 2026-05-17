import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const PROTOCOLS_DB_ID = process.env.NOTION_BLOG_DB_ID!;
const TOOLS_DB_ID     = process.env.NOTION_TOOLS_DB_ID!;
const STORAGE_BUCKET  = 'notion-files';
const STORAGE_PREFIX  = 'covers';

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
  | { type: 'checkbox'; checkbox: boolean }
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

function checkbox(p: NotionProp | undefined): boolean {
  if (!p || p.type !== 'checkbox') return false;
  return p.checkbox;
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

  const { data: existing } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(STORAGE_PREFIX, { search: `${slug}.jpg` });

  if (existing && existing.length > 0) {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  }

  const imgRes = await fetch(notionUrl);
  if (!imgRes.ok) return notionUrl;

  const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${STORAGE_PREFIX}/${slug}.${ext}`;
  const buffer = await imgRes.arrayBuffer();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    console.error(`[sync-notion] Storage upload failed for ${slug}:`, error.message);
    return notionUrl;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

type NotionPage = { id: string; properties: Record<string, unknown> };

// ---- Query Notion with filter, handling pagination ----

async function queryNotion(databaseId: string, filter: Record<string, unknown>): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter,
        ...(cursor ? { start_cursor: cursor } : {}),
      }),
    });

    if (!res.ok) throw new Error(`Notion API error: ${await res.text()}`);

    const json = await res.json() as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    pages.push(...json.results);
    cursor = json.has_more && json.next_cursor ? json.next_cursor : undefined;
  } while (cursor);

  return pages;
}

// ---- Sync protocols (articles) ----

async function syncProtocols() {
  const pages = await queryNotion(PROTOCOLS_DB_ID, {
    property: 'Status',
    status: { equals: 'Published' },
  });

  const rows = await Promise.all(
    pages
      .map(page => {
        const p = page.properties as Record<string, NotionProp>;
        return { p, slug: text(p['Slug']) };
      })
      .filter(({ slug }) => slug.length > 0)
      .map(async ({ p }) => {
        const slug = text(p['Slug']);
        const file = notionFile(p['Cover Image 1']) ?? notionFile(p['Cover Image']);

        let cover_image = '';
        if (file) {
          cover_image = file.isHosted
            ? await persistCoverImage(slug, file.url)
            : file.url;
        }

        return {
          title:            text(p['Title']),
          slug,
          branch:           select(p['Branch']),
          status:           status(p['Status']),
          summary:          text(p['Summary']),
          excerpt:          text(p['Excerpt']),
          problem:          text(p['Blog Post']),
          cta:              text(p['CTA']),
          protocol:         text(p['Protocol']),
          keyword:          text(p['WhatsApp Trigger']),
          cover_image,
          read_time:        text(p['Read Time']),
          meta_description: text(p['Meta Description']),
          seo_title:        text(p['SEO Title']),
          featured:         checkbox(p['Featured']),
        };
      })
  );

  if (rows.length === 0) return { synced: 0, deleted: 0 };

  const supabase = getSupabase();

  const { error: upsertError } = await supabase
    .from('protocols')
    .upsert(rows, { onConflict: 'slug' });

  if (upsertError) throw new Error(`Protocols upsert failed: ${upsertError.message}`);

  // Delete any protocols no longer published in Notion
  const publishedSlugs = rows.map(r => r.slug);
  const { count: deleted } = await supabase
    .from('protocols')
    .delete({ count: 'exact' })
    .not('slug', 'in', `(${publishedSlugs.join(',')})`);

  return { synced: rows.length, deleted: deleted ?? 0 };
}

// ---- Sync tools ----

async function syncTools() {
  if (!TOOLS_DB_ID) return { synced: 0, deleted: 0 };

  const pages = await queryNotion(TOOLS_DB_ID, {
    property: 'Status',
    status: { does_not_equal: 'Draft' },
  });

  type ToolRow = {
    name: string; slug: string; branch: string; keyword: string;
    tldr: string; description: string; short_description: string;
    featured: boolean; color: string; meta_description: string;
    cover_image: string; status: string;
  };

  const rows: ToolRow[] = pages.flatMap(page => {
    const p = page.properties as Record<string, NotionProp>;
    const slug = text(p['Slug']);
    if (!slug) return [];

    const file = notionFile(p['Cover Image']) ?? notionFile(p['Cover Image 1']);
    const cover_image = file?.url ?? '';

    return [{
      name:              text(p['Name']),
      slug,
      branch:            select(p['Branch']),
      keyword:           text(p['WhatsApp Trigger']),
      tldr:              text(p['TL;DR']),
      description:       text(p['Blog Post']),
      short_description: text(p['Short Description']),
      featured:          checkbox(p['Featured']),
      color:             text(p['Color']) || '#ffffff',
      meta_description:  text(p['Meta Description']),
      cover_image,
      status:            status(p['Status']) || 'Live',
    }];
  });

  if (rows.length === 0) return { synced: 0, deleted: 0 };

  const supabase = getSupabase();

  const { error: upsertError } = await supabase
    .from('tools')
    .upsert(rows, { onConflict: 'slug' });

  if (upsertError) throw new Error(`Tools upsert failed: ${upsertError.message}`);

  // Delete any tools no longer in the synced set
  const syncedSlugs = rows.map(r => r.slug);
  const { count: deleted } = await supabase
    .from('tools')
    .delete({ count: 'exact' })
    .not('slug', 'in', `(${syncedSlugs.join(',')})`);

  return { synced: rows.length, deleted: deleted ?? 0 };
}

// ---- Handler ----

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [protocols, tools] = await Promise.all([syncProtocols(), syncTools()]);

    console.log(`[sync-notion] protocols: +${protocols.synced} synced, -${protocols.deleted} deleted`);
    console.log(`[sync-notion] tools: +${tools.synced} synced, -${tools.deleted} deleted`);

    return NextResponse.json({ protocols, tools });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[sync-notion] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
