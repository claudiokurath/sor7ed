import { Client } from '@notionhq/client'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { cleanBlogPost, cleanProtocolField, parseTemplateToQuestions } from '../lib/utils/clean-blog'

// Robust environment variable loader
function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  
  envContent.split('\n').forEach((line, index) => {
    const trimmed = line.trim()
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return
    
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) {
      console.warn(`[Env] Skipping malformed line ${index + 1}: ${line}`)
      return
    }
    
    const key = trimmed.substring(0, equalIndex).trim()
    const value = trimmed.substring(equalIndex + 1).trim()
    
    if (key) {
      env[key] = value
    }
  })
  
  return env
}

const env = loadEnvironment()
const notion = new Client({ auth: env.NOTION_API_KEY })
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

type NotionCover = { type: 'file'; file: { url: string } } | { type: 'external'; external: { url: string } } | null;
type NotionPage = { id: string; properties: Record<string, unknown>; cover?: NotionCover };

const getCover = (page: NotionPage): string => {
  if (!page.cover) return '';
  if (page.cover.type === 'external') return page.cover.external.url;
  if (page.cover.type === 'file') return page.cover.file.url;
  return '';
};

const getText = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  const p = prop as { rich_text?: Array<{ plain_text: string }>; title?: Array<{ plain_text: string }> };
  if (p.rich_text) return p.rich_text.map(t => t.plain_text).join('');
  if (p.title) return p.title.map(t => t.plain_text).join('');
  return '';
};

const getSelect = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  return (prop as { select?: { name?: string } }).select?.name || '';
};

const getStatus = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  return (prop as { status?: { name?: string } }).status?.name || '';
};

const getCheckbox = (prop: unknown): boolean => {
  if (typeof prop !== 'object' || prop === null) return false;
  return (prop as { checkbox?: boolean }).checkbox || false;
};

const getFiles = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  const p = prop as { files?: Array<{ file?: { url: string }; external?: { url: string } }> };
  return p.files?.[0]?.file?.url || p.files?.[0]?.external?.url || '';
};

const getUrl = (prop: unknown): string => {
  if (typeof prop !== 'object' || prop === null) return '';
  return (prop as { url?: string }).url || '';
};

const getMultiSelect = (prop: unknown): string[] => {
  if (typeof prop !== 'object' || prop === null) return [];
  return (prop as { multi_select?: Array<{ name: string }> }).multi_select?.map(s => s.name) || [];
};

/**
 * Safely parses JSON values with error boundaries to prevent script crashes on invalid input.
 */
function safeJsonParse<T>(value: string, fallback: T): T {
  if (!value || value.trim() === '') return fallback;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`[Sync] JSON parse failed for value: "${value.substring(0, 100)}..."`, error);
    return fallback;
  }
}

/**
 * Controlled promise pool to limit execution concurrency.
 */
async function runWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const p = Promise.resolve().then(() => fn(items[i], i));
    results.push(p as any);
    
    if (limit <= items.length) {
      const e: Promise<void> = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

/**
 * Fetch all pages from a Notion database supporting API pagination.
 */
async function fetchAllNotionPages(database_id: string, filter?: any): Promise<NotionPage[]> {
  const results: NotionPage[] = []
  let cursor: string | undefined = undefined
  let pageCount = 0

  do {
    console.log(`[Notion] Fetching page ${++pageCount} from database ${database_id}...`)
    
    const response = await notion.databases.query({
      database_id,
      filter,
      start_cursor: cursor,
      page_size: 100,
    })
    
    results.push(...(response.results as NotionPage[]))
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  console.log(`[Notion] Retrieved ${results.length} total records from ${pageCount} API pages`)
  return results
}

/**
 * Checks if a local cover image exists in public/covers/ or public/ 
 * using the slug or formatted keyword.
 */
function getLocalCoverImage(slug: string, keyword: string): string | null {
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  // Potential filenames to check (fully normalized to lowercase and hyphenated)
  const filenames = [
    slug?.toLowerCase().trim(),
    slug?.toLowerCase().trim().replace(/[\s_]+/g, '-'),
    keyword?.toLowerCase().trim().replace(/[\s_]+/g, '-'),
    keyword?.toLowerCase().trim()
  ].filter(Boolean);

  for (const filename of filenames) {
    for (const ext of extensions) {
      // Check 1: public/covers/filename.ext
      const coversPath = path.join(process.cwd(), 'public', 'covers', `${filename}.${ext}`);
      if (fs.existsSync(coversPath)) {
        console.log(`[Sync] Found local cover in public/covers/: /covers/${filename}.${ext}`);
        return `/covers/${filename}.${ext}`;
      }

      // Check 2: public/filename.ext
      const rootPath = path.join(process.cwd(), 'public', `${filename}.${ext}`);
      if (fs.existsSync(rootPath)) {
        console.log(`[Sync] Found local cover in public/: /${filename}.${ext}`);
        return `/${filename}.${ext}`;
      }

      // Check 3: public/Images/branches/filename.ext
      const branchPath = path.join(process.cwd(), 'public', 'Images', 'branches', `${filename}.${ext}`);
      if (fs.existsSync(branchPath)) {
        console.log(`[Sync] Found local cover in public/Images/branches/: /Images/branches/${filename}.${ext}`);
        return `/Images/branches/${filename}.${ext}`;
      }

      // Check 4: public/Images/branches/filename (with spaces).ext
      const spaceFilename = filename.replace(/-/g, ' ');
      const branchSpacePath = path.join(process.cwd(), 'public', 'Images', 'branches', `${spaceFilename}.${ext}`);
      if (fs.existsSync(branchSpacePath)) {
        console.log(`[Sync] Found local cover in public/Images/branches/: /Images/branches/${spaceFilename}.${ext}`);
        return `/Images/branches/${spaceFilename}.${ext}`;
      }

      // Check 5: public/Images/tools/filename.ext
      const toolCheckPath = path.join(process.cwd(), 'public', 'Images', 'tools', `${filename}.${ext}`);
      if (fs.existsSync(toolCheckPath)) {
        console.log(`[Sync] Found local cover in public/Images/tools/: /Images/tools/${filename}.${ext}`);
        return `/Images/tools/${filename}.${ext}`;
      }

      // Check 6: public/Images/tools/filename (with spaces).ext
      const toolCheckSpacePath = path.join(process.cwd(), 'public', 'Images', 'tools', `${spaceFilename}.${ext}`);
      if (fs.existsSync(toolCheckSpacePath)) {
        console.log(`[Sync] Found local cover in public/Images/tools/: /Images/tools/${spaceFilename}.${ext}`);
        return `/Images/tools/${spaceFilename}.${ext}`;
      }

      // Check 7: public/Images/tools/filename uppercase.ext
      const upperSpaceFilename = spaceFilename.toUpperCase();
      const toolCheckUpperSpacePath = path.join(process.cwd(), 'public', 'Images', 'tools', `${upperSpaceFilename}.${ext}`);
      if (fs.existsSync(toolCheckUpperSpacePath)) {
        console.log(`[Sync] Found local cover in public/Images/tools/: /Images/tools/${upperSpaceFilename}.${ext}`);
        return `/Images/tools/${upperSpaceFilename}.${ext}`;
      }
    }
  }

  return null;
}

/**
 * Downloads an image from Notion/External URL and uploads it to Supabase Storage.
 * This guarantees permanent image links (bypassing Notion's 1-hour expiry) 
 * and allows on-the-fly Supabase Image Transformations.
 */
async function uploadCoverImageToSupabase(url: string, folder: string, filename: string): Promise<string> {
  if (!url) return '';
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`[Sync] Failed to download cover image from: ${url}`);
      return url;
    }
    
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.includes('png') ? 'png' : contentType.includes('gif') ? 'gif' : 'jpg';
    
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storagePath = `${folder}/${filename}.${extension}`;
    const { error } = await supabase.storage
      .from('notion-files')
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`[Sync] Failed to upload ${storagePath} to Supabase:`, error.message);
      return url;
    }

    const { data } = supabase.storage.from('notion-files').getPublicUrl(storagePath);
    return data.publicUrl;
  } catch (err) {
    console.error(`[Sync] Error downloading/uploading image ${url}:`, err);
    return url;
  }
}

async function syncProtocols(pages: NotionPage[]): Promise<string[]> {
  console.log(`[Sync] Processing ${pages.length} protocols...`)

  const results = await runWithLimit(pages, 5, async (page, index) => {
    const props = page.properties
    const slug = getText(props.Slug) || page.id;
    const title = getText(props.Title);
    const keyword = getText(props['WhatsApp Trigger']);
    
    let cover_image = '';
    
    // 1. Check for local file first
    const localCover = getLocalCoverImage(slug, keyword);
    if (localCover) {
      cover_image = localCover;
    } else {
      // 2. Use the raw URL directly from Notion — no download/re-upload
      const rawCover = getCover(page) || getFiles(props['Cover Image']) || getFiles(props['Cover Image 1']) || getUrl(props['Cover Image']) || getUrl(props['Cover Image 1']) || getText(props['Cover Image URL']);
      if (rawCover) {
        cover_image = rawCover;
        console.log(`[Sync] Using cover URL for protocol: ${slug}`);
      }
    }

    const data = {
      title,
      slug,
      branch: getSelect(props.Branch),
      keyword,
      tldr: getText(props['TL;DR']),
      problem: cleanBlogPost(getText(props['Blog Post']), title),
      protocol: cleanProtocolField(getText(props.Protocol), title),
      cta: getText(props.CTA),
      excerpt: getText(props.Excerpt),
      seo_title: getText(props['SEO Title']),
      meta_description: getText(props['Meta Description']),
      read_time: getText(props['Read Time']),
      deep_dive: getText(props['Deep Dive']),
      status: getStatus(props.Status) || 'Live',
      level: getSelect(props.Level) || 'primer',
      summary: getText(props.Summary),
      featured: getCheckbox(props.Featured),
      cover_image,
      related_assessments: safeJsonParse(getText(props['Related Assessments']), [])
    }

    const { error } = await supabase.from('protocols').upsert(data, { onConflict: 'slug' })
    if (error) {
      console.error(`[Sync] Error syncing protocol "${data.title}":`, error.message)
      throw error;
    }
    
    console.log(`[Sync] Synced protocol (${index + 1}/${pages.length}): ${data.title}`)
    return slug;
  });

  return results.filter(Boolean);
}

async function syncTools(pages: NotionPage[]): Promise<string[]> {
  console.log(`[Sync] Processing ${pages.length} tools...`)

  const results = await runWithLimit(pages, 5, async (page, index) => {
    const props = page.properties
    const slug = getText(props.Slug) || page.id;
    const name = getText(props.Name);
    const keyword = getText(props['WhatsApp Trigger']);
    
    let cover_image = '';
    
    // 1. Check for local file first
    const localCover = getLocalCoverImage(slug, keyword);
    if (localCover) {
      cover_image = localCover;
    } else {
      // 2. Use the raw URL directly from Notion — no download/re-upload
      const rawCover = getCover(page) || getFiles(props['Cover Image']) || getUrl(props['Cover Image']) || getText(props['Cover Image URL']);
      if (rawCover) {
        cover_image = rawCover;
        console.log(`[Sync] Using cover URL for tool: ${slug}`);
      }
    }

    const rawTemplate = getText(props.Template);
    const summary = getText(props.Summary);
    const parsedQuestions = parseTemplateToQuestions(rawTemplate);

    const data = {
      name,
      slug,
      branch: getSelect(props.Branch),
      keyword,
      tldr: getText(props['TL,:DR']) || getText(props['TL;DR']) || summary, // Handle potential typo or use summary
      description: cleanBlogPost(getText(props['Blog Post']), name),
      long_description: summary,
      short_description: summary,
      featured: getCheckbox(props.Featured),
      questions: parsedQuestions,
      color: getText(props.Color) || '#ffffff',
      meta_description: getText(props['Meta Description']),
      cover_image,
      status: getStatus(props.Status) || 'Live'
    }

    const { error } = await supabase.from('tools').upsert(data, { onConflict: 'slug' })
    if (error) {
      console.error(`[Sync] Error syncing tool "${data.name}":`, error.message)
      throw error;
    }
    
    console.log(`[Sync] Synced tool (${index + 1}/${pages.length}): ${data.name}`)
    return slug;
  });

  return results.filter(Boolean);
}

async function syncBranches(pages: NotionPage[]): Promise<string[]> {
  console.log(`[Sync] Processing ${pages.length} branches...`)

  const results = await runWithLimit(pages, 5, async (page, index) => {
    const props = page.properties
    const slug = getText(props.Slug);
    const name = getText(props.Name);
    
    let cover_image = '';
    
    // 1. Check for local file first
    const localCover = getLocalCoverImage(slug, '');
    if (localCover) {
      cover_image = localCover;
    } else {
      // 2. Use the raw URL directly from Notion — no download/re-upload
      const rawCover = getCover(page) || getUrl(props['Cover Image']);
      if (rawCover && slug) {
        cover_image = rawCover;
        console.log(`[Sync] Using cover URL for branch: ${slug}`);
      }
    }

    const data = {
      notion_id: page.id,
      num: getText(props.Number),
      name,
      slug,
      color: getText(props.Color) || '#ffffff',
      icon: getText(props.Icon),
      description: getText(props.Description),
      cover_image,
    }

    const { error } = await supabase.from('branches').upsert(data, { onConflict: 'slug' })
    if (error) {
      console.error(`[Sync] Error syncing branch "${data.name}":`, error.message)
      throw error;
    }
    
    console.log(`[Sync] Synced branch (${index + 1}/${pages.length}): ${data.name}`)
    return slug;
  });

  return results.filter(Boolean);
}

/**
 * Safely removes stale items that exist in the database but are no longer in the synced list.
 */
async function deleteStaleRecords(table: string, syncedKeys: string[]) {
  if (syncedKeys.length === 0) return

  const keyColumn = table === 'site_config' ? 'key' : 'slug'

  // 1. Get all current keys in the database
  const { data, error: fetchError } = await supabase
    .from(table)
    .select(keyColumn)

  if (fetchError) {
    if (fetchError.code === 'PGRST205') return; // Skip if table doesn't exist yet
    console.error(`[Sync] Failed to fetch existing keys for ${table} cleanup:`, fetchError.message)
    return
  }

  // 2. Identify stale keys (in DB but not in synced list)
  const existingKeys = data.map(item => (item as any)[keyColumn])
  const staleKeys = existingKeys.filter(k => !syncedKeys.includes(k))

  if (staleKeys.length === 0) {
    console.log(`[Sync] No stale records to clean up in ${table}`)
    return
  }

  console.log(`[Sync] Cleaning up ${staleKeys.length} stale records in ${table}:`, staleKeys)

  // 3. Delete those specific keys
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .in(keyColumn, staleKeys)

  if (deleteError) {
    console.error(`[Sync] Failed to delete stale records from ${table}:`, deleteError.message)
  } else {
    console.log(`[Sync] Successfully cleaned up stale records from ${table}`)
  }
}

async function syncSiteConfig(pages: NotionPage[]): Promise<string[]> {
  console.log(`[Sync] Processing ${pages.length} site configs...`)
  
  // Check if site_config table exists in Supabase
  const { error: tableCheck } = await supabase.from('site_config').select('key').limit(1)
  if (tableCheck && tableCheck.code === 'PGRST205') {
    console.warn('\n[Warning] Table "site_config" does not exist in Supabase yet.')
    console.warn('Please execute the SQL migration in "supabase/migrations/20260521_add_site_config.sql" in your Supabase dashboard to enable database-driven styling and config.\n')
    return []
  }

  // Fetch columns from PostgREST OpenAPI spec to be robust against schema mismatches
  let hasDescriptionColumn = false;
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (res.ok) {
      const schema = await res.json();
      const props = schema?.definitions?.site_config?.properties;
      hasDescriptionColumn = props && 'description' in props;
    }
  } catch (err) {
    console.error('[Sync] Failed to fetch site_config schema:', err);
  }

  const results = await runWithLimit(pages, 5, async (page, index) => {
    const props = page.properties
    const key = getText(props.Key);
    if (!key) return '';
    const name = getText(props.Name);
    const text_value = getText(props['Text Value']);
    const color = getText(props.Color);
    const description = getText(props.Description);
    const active = getCheckbox(props.Active);
    
    let image_url = '';
    const rawCover = getCover(page) || getFiles(props.Image) || getUrl(props.Image);
    if (rawCover) {
      image_url = await uploadCoverImageToSupabase(rawCover, 'site-config', key);
    }

    const data: any = {
      key,
      name,
      value_text: text_value || null,
      value_color: color || null,
      image_url: image_url || null,
      active
    }

    if (hasDescriptionColumn) {
      data.description = description || null;
    }

    const { error } = await supabase.from('site_config').upsert(data, { onConflict: 'key' })
    if (error) {
      console.error(`[Sync] Error syncing site config "${data.name}":`, error.message)
      throw error;
    }
    
    console.log(`[Sync] Synced site config (${index + 1}/${pages.length}): ${data.name}`)
    return key;
  });

  return results.filter(Boolean);
}

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
        newTag = `[INTRO — Hushed Vocals, Intimate Melodic Rap, ${vibeStr}]`;
      }
      // VERSE
      else if (/^\[(FINAL\s+)?VERSE\s*(\d+)?(\s*—.*)?\]$/i.test(bracket)) {
        const numMatch = bracket.match(/\d+/);
        const num = numMatch ? ` ${numMatch[0]}` : '';
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}VERSE${num} — Intimate Melodic Rap, Hushed Vocals, ${vibeStr}]`;
      }
      // RAP VERSE
      else if (/^\[RAP\s+VERSE\s*(\d+)?(\s*—.*)?\]$/i.test(bracket)) {
        const numMatch = bracket.match(/\d+/);
        const num = numMatch ? ` ${numMatch[0]}` : '';
        newTag = `[RAP VERSE${num} — Intimate Melodic Rap, Hushed Vocals, ${vibeStr}]`;
      }
      // PRE-CHORUS / PRE-HOOK
      else if (/^\[(FINAL\s+)?PRE-CHORUS(\s*—.*)?\]$/i.test(bracket) || /^\[(FINAL\s+)?PRE-HOOK(\s*—.*)?\]$/i.test(bracket)) {
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}PRE-CHORUS — Emotional Synth Buildup, Hushed Vocals, ${selectedVibes[0] || 'Intimate'}, Rising Intensity]`;
      }
      // CHORUS / HOOK
      else if (/^\[(FINAL\s+)?CHORUS(\s*—.*)?\]$/i.test(bracket) || /^\[(FINAL\s+)?HOOK(\s*—.*)?\]$/i.test(bracket)) {
        const prefix = /^\[FINAL/i.test(bracket) ? 'FINAL ' : '';
        newTag = `[${prefix}CHORUS — Smooth R&B Ballad, Emotional Synth Buildup, ${vibeStr}]`;
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
        newTag = `[RAP BREAK — Smooth R&B Ballad, Intimate Melodic Rap]`;
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

async function syncSongBrackets() {
  const songsDbId = env.NOTION_SONGS_DB_ID || '2780d601-4acc-8064-a87e-edc5e96fe22e';
  console.log(`[Sync] Formatting lyric style tags in Notion database ${songsDbId}...`);
  try {
    const pages = await fetchAllNotionPages(songsDbId);
    let totalUpdated = 0;

    for (const page of pages) {
      const props = page.properties;
      const title = getText(props.Title) || getText(props['Song Title']) || 'Untitled';
      const lyricsText = getText(props.Lyrics);
      const vibes = getMultiSelect(props['Emotion&Vibe']);

      const updatedLyrics = replaceSongTags(lyricsText, vibes);

      if (updatedLyrics !== lyricsText) {
        console.log(`[Sync] Updating tags for song "${title}"...`);
        const textChunks = chunkSongText(updatedLyrics, 1950);
        await notion.pages.update({
          page_id: page.id,
          properties: {
            Lyrics: {
              rich_text: textChunks
            }
          }
        });
        totalUpdated++;
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }
    console.log(`[Sync] Completed song brackets sync. Updated ${totalUpdated} songs.`);
  } catch (err: any) {
    console.error('[Sync] Error formatting song tags:', err.message);
  }
}

async function sync() {
  console.log('Starting safe synchronization...')
  
  // 1. Fetch ALL records from Notion databases (regardless of status)
  let allProtocols: NotionPage[] = [];
  try {
    allProtocols = await fetchAllNotionPages(env.NOTION_BLOG_DB_ID);
  } catch (err: any) {
    console.error('[Sync] Failed to fetch protocols from Notion:', err.message);
  }

  let allTools: NotionPage[] = [];
  try {
    allTools = await fetchAllNotionPages(env.NOTION_TOOLS_DB_ID);
  } catch (err: any) {
    console.error('[Sync] Failed to fetch tools from Notion:', err.message);
  }

  let branchesData: NotionPage[] = [];
  try {
    const branchesDbId = env.NOTION_BRANCHES_DB_ID || 'bf1e89a5167e484b9fc85376031f72e3';
    branchesData = await fetchAllNotionPages(branchesDbId);
  } catch (err: any) {
    console.error('[Sync] Failed to fetch branches from Notion:', err.message);
  }

  let siteConfigs: NotionPage[] = [];
  try {
    const siteConfigDbId = env.NOTION_SITE_CONFIG_DB_ID || '3670d601-4acc-8137-a1e3-daf1e0bdfa51';
    siteConfigs = await fetchAllNotionPages(siteConfigDbId);
  } catch (err: any) {
    console.error('[Sync] Failed to fetch site configs from Notion:', err.message);
  }
  
  if (allProtocols.length === 0 && allTools.length === 0 && branchesData.length === 0 && siteConfigs.length === 0) {
    console.error('[Sync] No data retrieved from Notion. Aborting sync to prevent data loss.')
    return
  }

  // 2. Protocols sync
  let syncedProtocolSlugs: string[] = [];
  if (allProtocols.length > 0) {
    try {
      const allProtocolSlugs = allProtocols.map(p => getText(p.properties.Slug) || p.id).filter(Boolean);
      syncedProtocolSlugs = await syncProtocols(allProtocols);
      await deleteStaleRecords('protocols', allProtocolSlugs);
    } catch (err: any) {
      console.error('[Sync] Protocols sync failed:', err.message);
    }
  }

  // 3. Tools sync
  let syncedToolSlugs: string[] = [];
  if (allTools.length > 0) {
    try {
      const allToolSlugs = allTools.map(p => getText(p.properties.Slug) || p.id).filter(Boolean);
      syncedToolSlugs = await syncTools(allTools);
      await deleteStaleRecords('tools', allToolSlugs);
    } catch (err: any) {
      console.error('[Sync] Tools sync failed:', err.message);
    }
  }

  // 4. Branches sync
  let syncedBranchSlugs: string[] = [];
  if (branchesData.length > 0) {
    try {
      syncedBranchSlugs = await syncBranches(branchesData);
      await deleteStaleRecords('branches', syncedBranchSlugs);
    } catch (err: any) {
      console.error('[Sync] Branches sync failed:', err.message);
    }
  }

  // 5. Site config sync
  let syncedConfigKeys: string[] = [];
  if (siteConfigs.length > 0) {
    try {
      const allConfigKeys = siteConfigs.map(p => getText(p.properties.Key)).filter(Boolean);
      syncedConfigKeys = await syncSiteConfig(siteConfigs);
      await deleteStaleRecords('site_config', allConfigKeys);
    } catch (err: any) {
      console.error('[Sync] Site config sync failed:', err.message);
    }
  }
  
  // 6. Sync song brackets
  try {
    await syncSongBrackets();
  } catch (err: any) {
    console.error('[Sync] Songs bracket sync failed:', err.message);
  }
  
  console.log('All syncs complete successfully!')
  console.log(`[Sync] Protocols synced: ${syncedProtocolSlugs.length}`)
  console.log(`[Sync] Tools synced: ${syncedToolSlugs.length}`)
  console.log(`[Sync] Branches synced: ${syncedBranchSlugs.length}`)
  console.log(`[Sync] Site config parameters synced: ${syncedConfigKeys.length}`)
}

sync().catch(console.error)
