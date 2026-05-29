import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cleanBlogPost, cleanProtocolField, parseTemplateToQuestions } from '@/lib/utils/clean-blog';

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

const SUPABASE_URL_PREFIX = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/`
  : '';

function isAlreadyPersisted(url: string): boolean {
  return SUPABASE_URL_PREFIX.length > 0 && url.startsWith(SUPABASE_URL_PREFIX);
}

// Download from Notion → upload to Supabase Storage → return permanent public URL
// Runs ONE AT A TIME to avoid hammering S3 or Supabase rate limits.
async function persistCoverImage(slug: string, notionUrl: string, force = false): Promise<string> {
  const supabase = getSupabase();

  // Skip if already a permanent Supabase URL (unless force)
  if (!force && isAlreadyPersisted(notionUrl)) return notionUrl;

  // Check if already stored under any extension
  const { data: existing } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(STORAGE_PREFIX, { search: slug });

  if (!force && existing && existing.length > 0) {
    const match = existing.find(f => f.name.startsWith(slug + '.'));
    if (match) {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${STORAGE_PREFIX}/${match.name}`);
      return data.publicUrl;
    }
  }

  // Download the image
  let imgRes: Response;
  try {
    imgRes = await fetch(notionUrl, {
      headers: { 'User-Agent': 'SOR7ED-Sync/1.0' },
    });
  } catch (err) {
    console.error(`[persist-cover] fetch failed for ${slug}:`, err);
    return notionUrl;
  }

  if (!imgRes.ok) {
    console.error(`[persist-cover] fetch ${imgRes.status} for ${slug}: ${notionUrl.slice(0, 80)}`);
    return notionUrl;
  }

  const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const storagePath = `${STORAGE_PREFIX}/${slug}.${ext}`;

  const buffer = await imgRes.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true });

  if (uploadError) {
    console.error(`[persist-cover] upload failed for ${slug}:`, uploadError.message);
    return notionUrl;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  console.log(`[persist-cover] ✓ ${slug} → ${data.publicUrl}`);
  return data.publicUrl;
}

type NotionPage = { id: string; properties: Record<string, unknown> };

async function queryNotion(databaseId: string, filter?: Record<string, unknown>): Promise<NotionPage[]> {
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
        ...(filter && Object.keys(filter).length > 0 ? { filter } : {}),
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

async function syncProtocols(force = false) {
  const pages = await queryNotion(PROTOCOLS_DB_ID);

  const supabase = getSupabase();

  // Build rows with raw Notion URLs first — don't block on image downloads
  const rawRows = pages
    .map(page => {
      const p = page.properties as Record<string, NotionProp>;
      const slug = text(p['Slug']);
      if (!slug) return null;

      const file = notionFile(p['Cover Image 1']) ?? notionFile(p['Cover Image']);
      const notionImageUrl = file?.url ?? '';

      return {
        slug,
        notionImageUrl,
        isHosted: file?.isHosted ?? false,
        row: {
          title:            text(p['Title']),
          slug,
          branch:           select(p['Branch']),
          status:           status(p['Status']),
          summary:          text(p['Summary']),
          excerpt:          text(p['Excerpt']),
          problem:          cleanBlogPost(text(p['Blog Post']), text(p['Title'])),
          cta:              text(p['CTA']),
          protocol:         cleanProtocolField(text(p['Protocol']), text(p['Title'])),
          keyword:          text(p['WhatsApp Trigger']),
          cover_image:      notionImageUrl,
          read_time:        text(p['Read Time']),
          meta_description: text(p['Meta Description']),
          seo_title:        text(p['SEO Title']),
          featured:         checkbox(p['Featured']),
        },
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rawRows.length === 0) return { synced: 0, deleted: 0, images: 0 };

  // Upsert text data immediately
  // Deduplicate by slug — keep last occurrence
  const protocolsDeduped = Object.values(
    Object.fromEntries(rawRows.map(r => [r.row.slug, r.row]))
  );
  const { error: upsertError } = await supabase
    .from('protocols')
    .upsert(protocolsDeduped, { onConflict: 'slug' });

  if (upsertError) throw new Error(`Protocols upsert failed: ${upsertError.message}`);

  // Persist cover images SEQUENTIALLY to avoid rate limits
  let images = 0;
  for (const { slug, notionImageUrl, isHosted } of rawRows) {
    if (!notionImageUrl) continue;

    const persistedUrl = isHosted
      ? await persistCoverImage(slug, notionImageUrl, force)
      : notionImageUrl;

    if (persistedUrl !== notionImageUrl) {
      await supabase.from('protocols').update({ cover_image: persistedUrl }).eq('slug', slug);
      images++;
    }
  }

  // Delete protocols no longer published in Notion
  const publishedSlugs = rawRows.map(r => r.slug);
  const { count: deleted } = await supabase
    .from('protocols')
    .delete({ count: 'exact' })
    .not('slug', 'in', `(${publishedSlugs.join(',')})`);

  return { synced: rawRows.length, deleted: deleted ?? 0, images };
}

// ---- Sync tools ----

async function syncTools(force = false) {
  if (!TOOLS_DB_ID) return { synced: 0, deleted: 0, images: 0 };

  const pages = await queryNotion(TOOLS_DB_ID);

  const supabase = getSupabase();

  type ToolRaw = {
    slug: string;
    notionImageUrl: string;
    isHosted: boolean;
    row: {
      name: string; slug: string; branch: string; keyword: string;
      tldr: string; description: string; short_description: string;
      long_description: string;
      featured: boolean; color: string; meta_description: string;
      cover_image: string; status: string; questions: any[];
    };
  };

  const rawRows: ToolRaw[] = pages.flatMap(page => {
    const p = page.properties as Record<string, NotionProp>;
    const slug = text(p['Slug']);
    if (!slug) return [];

    const file = notionFile(p['Cover Image']) ?? notionFile(p['Cover Image 1']);
    const notionImageUrl = file?.url ?? '';

    const rawTemplate = text(p['Template']);
    const summary = text(p['Summary']);
    const parsedQuestions = parseTemplateToQuestions(rawTemplate);

    return [{
      slug,
      notionImageUrl,
      isHosted: file?.isHosted ?? false,
      row: {
        name:              text(p['Name']),
        slug,
        branch:            select(p['Branch']),
        keyword:           text(p['WhatsApp Trigger']),
        tldr:              text(p['TL;DR']) || summary,
        description:       cleanBlogPost(text(p['Blog Post']), text(p['Name'])),
        short_description: summary,
        long_description:  summary,
        featured:          checkbox(p['Featured']),
        color:             text(p['Color']) || '#ffffff',
        meta_description:  text(p['Meta Description']),
        cover_image:       notionImageUrl,
        status:            (['Published','Live'].includes(status(p['Status'])) ? 'Published' : (status(p['Status']) || 'Draft')),
        questions:         parsedQuestions,
      },
    }];
  });

  if (rawRows.length === 0) return { synced: 0, deleted: 0, images: 0 };

  // Deduplicate by slug — keep last occurrence
  const toolsDeduped = Object.values(
    Object.fromEntries(rawRows.map(r => [r.row.slug, r.row]))
  );
  const { error: upsertError } = await supabase
    .from('tools')
    .upsert(toolsDeduped, { onConflict: 'slug' });

  if (upsertError) throw new Error(`Tools upsert failed: ${upsertError.message}`);

  // Persist cover images SEQUENTIALLY
  let images = 0;
  for (const { slug, notionImageUrl, isHosted } of rawRows) {
    if (!notionImageUrl) continue;

    const persistedUrl = isHosted
      ? await persistCoverImage(slug, notionImageUrl, force)
      : notionImageUrl;

    if (persistedUrl !== notionImageUrl) {
      await supabase.from('tools').update({ cover_image: persistedUrl }).eq('slug', slug);
      images++;
    }
  }

  const syncedSlugs = rawRows.map(r => r.slug);
  const { count: deleted } = await supabase
    .from('tools')
    .delete({ count: 'exact' })
    .not('slug', 'in', `(${syncedSlugs.join(',')})`);

  return { synced: rawRows.length, deleted: deleted ?? 0, images };
}

// ---- Handler ----

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get('force') === 'true';

  try {
    const [protocols, tools] = await Promise.all([
      syncProtocols(force),
      syncTools(force),
    ]);

    console.log(`[sync-notion] protocols: ${protocols.synced} synced, ${protocols.deleted} deleted, ${protocols.images} images persisted`);
    console.log(`[sync-notion] tools: ${tools.synced} synced, ${tools.deleted} deleted, ${tools.images} images persisted`);

    return NextResponse.json({ protocols, tools });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[sync-notion] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
