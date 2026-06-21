import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cleanBlogPost, cleanProtocolField, parseTemplateToQuestions } from '@/lib/utils/clean-blog';

export const dynamic = 'force-dynamic';

const PROTOCOLS_DB_ID = process.env.NOTION_BLOG_DB_ID!;
const TOOLS_DB_ID     = process.env.NOTION_TOOLS_DB_ID!;
const BRANCHES_DB_ID  = process.env.NOTION_BRANCHES_DB_ID || 'bf1e89a5167e484b9fc85376031f72e3';
const CONFIG_DB_ID    = process.env.NOTION_SITE_CONFIG_DB_ID || '3670d601-4acc-8137-a1e3-daf1e0bdfa51';
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
  | { type: 'date'; date: { start: string } | null }
  | { type: 'multi_select'; multi_select: Array<{ name: string }> };

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

function multiSelect(p: NotionProp | undefined): string[] {
  if (!p || p.type !== 'multi_select') return [];
  return p.multi_select?.map(s => s.name) || [];
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
async function persistCoverImage(slug: string, notionUrl: string, force = false, prefix = STORAGE_PREFIX): Promise<string> {
  const supabase = getSupabase();

  // Skip if already a permanent Supabase URL (unless force)
  if (!force && isAlreadyPersisted(notionUrl)) return notionUrl;

  // Check if already stored under any extension
  const { data: existing } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(prefix, { search: slug });

  if (!force && existing && existing.length > 0) {
    const match = existing.find(f => f.name.startsWith(slug + '.'));
    if (match) {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${prefix}/${match.name}`);
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
  const storagePath = `${prefix}/${slug}.${ext}`;

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

// ---- Sync branches ----

async function syncBranches(force = false) {
  if (!BRANCHES_DB_ID) return { synced: 0, deleted: 0, images: 0 };
  const pages = await queryNotion(BRANCHES_DB_ID);
  const supabase = getSupabase();

  const rawRows = pages
    .map(page => {
      const p = page.properties as Record<string, NotionProp>;
      const slug = text(p['Slug']);
      if (!slug) return null;

      const file = notionFile(p['Cover Image']);
      const notionImageUrl = file?.url ?? '';

      return {
        slug,
        notionImageUrl,
        isHosted: file?.isHosted ?? false,
        row: {
          notion_id: page.id,
          num: text(p['Number']),
          name: text(p['Name']),
          slug,
          color: text(p['Color']) || '#ffffff',
          icon: text(p['Icon']),
          description: text(p['Description']),
          cover_image: notionImageUrl,
        },
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rawRows.length === 0) return { synced: 0, deleted: 0, images: 0 };

  const branchesDeduped = Object.values(
    Object.fromEntries(rawRows.map(r => [r.row.slug, r.row]))
  );

  const { error: upsertError } = await supabase
    .from('branches')
    .upsert(branchesDeduped, { onConflict: 'slug' });

  if (upsertError) throw new Error(`Branches upsert failed: ${upsertError.message}`);

  let images = 0;
  for (const { slug, notionImageUrl, isHosted } of rawRows) {
    if (!notionImageUrl) continue;
    const persistedUrl = isHosted
      ? await persistCoverImage(slug, notionImageUrl, force, 'branches')
      : notionImageUrl;

    if (persistedUrl !== notionImageUrl) {
      await supabase.from('branches').update({ cover_image: persistedUrl }).eq('slug', slug);
      images++;
    }
  }

  const publishedSlugs = rawRows.map(r => r.slug);
  const { count: deleted } = await supabase
    .from('branches')
    .delete({ count: 'exact' })
    .not('slug', 'in', `(${publishedSlugs.join(',')})`);

  return { synced: rawRows.length, deleted: deleted ?? 0, images };
}

// ---- Sync site config ----

async function syncSiteConfig(force = false) {
  if (!CONFIG_DB_ID) return { synced: 0, deleted: 0, images: 0 };

  const supabase = getSupabase();
  const { error: tableCheck } = await supabase.from('site_config').select('key').limit(1);
  if (tableCheck && tableCheck.code === 'PGRST205') {
    console.warn('[sync-notion] Table "site_config" does not exist in Supabase yet.');
    return { synced: 0, deleted: 0, images: 0 };
  }

  // Fetch columns from PostgREST OpenAPI spec to be robust against schema mismatches
  let hasDescriptionColumn = false;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    });
    if (res.ok) {
      const schema = await res.json();
      const props = schema?.definitions?.site_config?.properties;
      hasDescriptionColumn = props && 'description' in props;
    }
  } catch (err) {
    console.error('[sync-notion] Failed to fetch site_config schema:', err);
  }

  const pages = await queryNotion(CONFIG_DB_ID);

  const rawRows = pages
    .map(page => {
      const p = page.properties as Record<string, NotionProp>;
      const key = text(p['Key']);
      if (!key) return null;

      const file = notionFile(p['Image']);
      const notionImageUrl = file?.url ?? '';

      const row: any = {
        key,
        name: text(p['Name']),
        value_text: text(p['Text Value']) || null,
        value_color: text(p['Color']) || null,
        image_url: notionImageUrl || null,
        active: checkbox(p['Active']),
      };

      if (hasDescriptionColumn) {
        row.description = text(p['Description']) || null;
      }

      return {
        key,
        notionImageUrl,
        isHosted: file?.isHosted ?? false,
        row,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rawRows.length === 0) return { synced: 0, deleted: 0, images: 0 };

  const configsDeduped = Object.values(
    Object.fromEntries(rawRows.map(r => [r.row.key, r.row]))
  );

  const { error: upsertError } = await supabase
    .from('site_config')
    .upsert(configsDeduped, { onConflict: 'key' });

  if (upsertError) throw new Error(`Site Config upsert failed: ${upsertError.message}`);

  let images = 0;
  for (const { key, notionImageUrl, isHosted } of rawRows) {
    if (!notionImageUrl) continue;
    const persistedUrl = isHosted
      ? await persistCoverImage(key, notionImageUrl, force, 'site-config')
      : notionImageUrl;

    if (persistedUrl !== notionImageUrl) {
      await supabase.from('site_config').update({ image_url: persistedUrl }).eq('key', key);
      images++;
    }
  }

  const activeKeys = rawRows.map(r => r.key);
  const { count: deleted } = await supabase
    .from('site_config')
    .delete({ count: 'exact' })
    .not('key', 'in', `(${activeKeys.join(',')})`);

  return { synced: rawRows.length, deleted: deleted ?? 0, images };
}

// ---- Sync song brackets ----

function replaceSongTags(text: string, vibes: string[]): string {
  const lines = text.split('\n');
  const selectedVibes = vibes.slice(0, 2);
  const vibeStr = selectedVibes.join(', ') || 'Emotional';
  
  const updatedLines = lines.map(line => {
    const trimmed = line.trim();
    // Match any bracket at the start of a line
    const bracketMatch = trimmed.match(/^(\[[^\]]+\])(.*)$/);
    if (bracketMatch) {
      const bracket = bracketMatch[1];
      const rest = bracketMatch[2];
      
      if (bracket.includes('GERMAN RAP — FAST, AGGRESSIVE')) {
        return line;
      }
      
      let newTag = bracket;
      
      // INTRO
      if (/^\[INTRO(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[INTRO — Hushed Vocals, Intimate Melodic Rap, ${vibeStr}, 85 BPM]`;
      }
      // VERSE
      else if (/^\[(FINAL\s+)?VERSE\s*(\d+)?(\s*—.*)?\]$/i.test(bracket)) {
        const numMatch = bracket.match(/\d+/);
        const num = numMatch ? ` ${numMatch[0]}` : '';
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}VERSE${num} — Intimate Melodic Rap, Hushed Vocals, 85 BPM, ${vibeStr}]`;
      }
      // RAP VERSE
      else if (/^\[RAP\s+VERSE\s*(\d+)?(\s*—.*)?\]$/i.test(bracket)) {
        const numMatch = bracket.match(/\d+/);
        const num = numMatch ? ` ${numMatch[0]}` : '';
        newTag = `[RAP VERSE${num} — Intimate Melodic Rap, Hushed Vocals, 85 BPM, ${vibeStr}]`;
      }
      // PRE-CHORUS / PRE-HOOK
      else if (/^\[(FINAL\s+)?PRE-CHORUS(\s*—.*)?\]$/i.test(bracket) || /^\[(FINAL\s+)?PRE-HOOK(\s*—.*)?\]$/i.test(bracket)) {
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}PRE-CHORUS — Emotional Synth Buildup, Hushed Vocals, ${selectedVibes[0] || 'Intimate'}, Rising Intensity]`;
      }
      // CHORUS / HOOK
      else if (/^\[(FINAL\s+)?CHORUS(\s*—.*)?\]$/i.test(bracket) || /^\[(FINAL\s+)?HOOK(\s*—.*)?\]$/i.test(bracket)) {
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}CHORUS — Smooth R&B Ballad, Emotional Synth Buildup, 85 BPM, ${vibeStr}]`;
      }
      // POST-CHORUS
      else if (/^\[POST-CHORUS(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[POST-CHORUS — Hushed Vocals, Smooth R&B Ballad, ${vibeStr}]`;
      }
      // BRIDGE
      else if (/^\[BRIDGE(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[BRIDGE — ${vibeStr}, Smooth R&B Ballad, Hushed Vocals]`;
      }
      // RAP BRIDGE
      else if (/^\[RAP\s+BRIDGE(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[RAP BRIDGE — ${vibeStr}, Smooth R&B Ballad, Hushed Vocals]`;
      }
      // RAP BREAK
      else if (/^\[RAP\s+BREAK(\s*—.*)?\]$/i.test(bracket) || /^\[RAP\s+–\s+BREAK(\s*—.*)?\]$/i.test(bracket) || /^\[RAP\s+—\s+BREAK(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[RAP BREAK — 85 BPM, Smooth R&B Ballad, Intimate Melodic Rap]`;
      }
      // OUTRO
      else if (/^\[OUTRO(\s*—.*)?\]$/i.test(bracket)) {
        newTag = `[OUTRO — Intimate Melodic Rap, Hushed Vocals Fadeout, ${selectedVibes[0] || 'Smooth'}]`;
      }
      
      if (newTag !== bracket) {
        return line.replace(bracket, newTag);
      }
    }
    return line;
  });
  
  return updatedLines.join('\n');
}

function chunkSongText(text: string, limit = 1950): Array<{ type: 'text'; text: { content: string } }> {
  const chunks: Array<{ type: 'text'; text: { content: string } }> = [];
  for (let i = 0; i < text.length; i += limit) {
    chunks.push({
      type: 'text',
      text: {
        content: text.substring(i, i + limit)
      }
    });
  }
  return chunks;
}

async function updateNotionPageLyrics(pageId: string, textChunks: Array<{ type: 'text'; text: { content: string } }>) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        Lyrics: {
          rich_text: textChunks,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update page ${pageId}: ${await res.text()}`);
  }
}

async function syncSongBrackets() {
  const songsDbId = process.env.NOTION_SONGS_DB_ID || '2780d601-4acc-8064-a87e-edc5e96fe22e';
  console.log(`[sync-notion] Formatting lyric style tags in Notion database ${songsDbId}...`);
  
  const pages = await queryNotion(songsDbId);
  let totalUpdated = 0;

  for (const page of pages) {
    const p = page.properties as Record<string, NotionProp>;
    const title = text(p['Title']) || text(p['Song Title']) || 'Untitled';
    const lyricsText = text(p['Lyrics']);
    const vibes = multiSelect(p['Emotion&Vibe']);

    const updatedLyrics = replaceSongTags(lyricsText, vibes);

    if (updatedLyrics !== lyricsText) {
      console.log(`[sync-notion] Updating tags for song "${title}"...`);
      const textChunks = chunkSongText(updatedLyrics, 1950);
      await updateNotionPageLyrics(page.id, textChunks);
      totalUpdated++;
      await new Promise(resolve => setTimeout(resolve, 350));
    }
  }

  return { synced: pages.length, updated: totalUpdated };
}

// ---- Handler ----

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronHeader = req.headers.get('x-vercel-cron');
  const validBearer = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const validCron = cronHeader === '1'; // Vercel sets this on cron calls
  
  if (!validBearer && !validCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get('force') === 'true';

  try {
    const [protocols, tools, branches, siteConfig, songs] = await Promise.all([
      syncProtocols(force),
      syncTools(force),
      syncBranches(force),
      syncSiteConfig(force),
      syncSongBrackets(),
    ]);

    console.log(`[sync-notion] protocols: ${protocols.synced} synced, ${protocols.deleted} deleted, ${protocols.images} images persisted`);
    console.log(`[sync-notion] tools: ${tools.synced} synced, ${tools.deleted} deleted, ${tools.images} images persisted`);
    console.log(`[sync-notion] branches: ${branches.synced} synced, ${branches.deleted} deleted, ${branches.images} images persisted`);
    console.log(`[sync-notion] site_config: ${siteConfig.synced} synced, ${siteConfig.deleted} deleted, ${siteConfig.images} images persisted`);
    console.log(`[sync-notion] songs: ${songs.synced} synced, ${songs.updated} songs updated with formatted brackets`);

    return NextResponse.json({ protocols, tools, branches, siteConfig, songs });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[sync-notion] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
