import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const NOTION_DB_ID = process.env.NOTION_BLOG_DB_ID!;

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---- Notion property extractors ----

type RichTextItem = { text: { content: string } };
type NotionProp =
  | { type: 'title'; title: RichTextItem[] }
  | { type: 'rich_text'; rich_text: RichTextItem[] }
  | { type: 'select'; select: { name: string } | null }
  | { type: 'status'; status: { name: string } | null }
  | { type: 'files'; files: Array<{ type: 'file'; file: { url: string } } | { type: 'external'; external: { url: string } }> }
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

function fileUrl(p: NotionProp | undefined): string {
  if (!p || p.type !== 'files' || p.files.length === 0) return '';
  const f = p.files[0];
  return f.type === 'file' ? f.file.url : f.type === 'external' ? f.external.url : '';
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

    const json = await res.json() as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    pages.push(...json.results);
    cursor = json.has_more && json.next_cursor ? json.next_cursor : undefined;
  } while (cursor);

  // Map Notion pages to Supabase rows
  const rows = pages
    .map(page => {
      const p = page.properties as Record<string, NotionProp>;
      return {
        title: text(p['Title']),
        slug: text(p['Slug']),
        branch: select(p['Branch']),
        status: status(p['Status']),
        summary: text(p['Summary']),
        excerpt: text(p['Excerpt']),
        problem: text(p['Blog Post']),
        cta: text(p['CTA']),
        protocol: text(p['Protocol']),
        keyword: text(p['WhatsApp Trigger']),
        cover_image: fileUrl(p['Cover Image 1']),
        read_time: text(p['Read Time']),
        meta_description: text(p['Meta Description']),
        seo_title: text(p['SEO Title']),
      };
    })
    .filter(r => r.slug.length > 0);

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
