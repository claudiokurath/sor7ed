import { Client } from '@notionhq/client'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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
  
  // Potential filenames to check
  const filenames = [
    slug,
    keyword?.toLowerCase().trim().replace(/\s+/g, '-'),
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
      // 2. Fall back to downloading Notion cover
      const rawCover = getCover(page) || getFiles(props['Cover Image']) || getFiles(props['Cover Image 1']) || getUrl(props['Cover Image']) || getUrl(props['Cover Image 1']) || getText(props['Cover Image URL']);
      if (rawCover) {
        console.log(`[Sync] Uploading cover image for protocol: ${slug}...`);
        cover_image = await uploadCoverImageToSupabase(rawCover, 'protocols', slug);
      }
    }

    const data = {
      title,
      slug,
      branch: getSelect(props.Branch),
      keyword,
      tldr: getText(props['TL;DR']),
      problem: getText(props['Blog Post']),
      protocol: getText(props.Protocol),
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
      // 2. Fall back to downloading Notion cover
      const rawCover = getCover(page) || getFiles(props['Cover Image']) || getUrl(props['Cover Image']) || getText(props['Cover Image URL']);
      if (rawCover) {
        console.log(`[Sync] Uploading cover image for tool: ${slug}...`);
        cover_image = await uploadCoverImageToSupabase(rawCover, 'tools', slug);
      }
    }

    const rawQuestions = getText(props.Questions);
    const data = {
      name,
      slug,
      branch: getSelect(props.Branch),
      keyword,
      tldr: getText(props['TL,:DR']) || getText(props['TL;DR']), // Handle potential typo
      description: getText(props['Blog Post']),
      long_description: getText(props['Long Description']),
      short_description: getText(props['Short Description']),
      featured: getCheckbox(props.Featured),
      questions: safeJsonParse(rawQuestions, []),
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
      // 2. Fall back to downloading Notion cover
      const rawCover = getCover(page) || getUrl(props['Cover Image']);
      if (rawCover && slug) {
        console.log(`[Sync] Uploading cover image for branch: ${slug}...`);
        cover_image = await uploadCoverImageToSupabase(rawCover, 'branches', slug);
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
async function deleteStaleRecords(table: string, syncedSlugs: string[]) {
  if (syncedSlugs.length === 0) return

  // 1. Get all current slugs in the database
  const { data, error: fetchError } = await supabase
    .from(table)
    .select('slug')
    .neq('slug', 'keep-it-safe-placeholder')

  if (fetchError) {
    console.error(`[Sync] Failed to fetch existing slugs for ${table} cleanup:`, fetchError.message)
    return
  }

  // 2. Identify stale slugs (in DB but not in synced list)
  const existingSlugs = data.map(item => item.slug)
  const staleSlugs = existingSlugs.filter(slug => !syncedSlugs.includes(slug))

  if (staleSlugs.length === 0) {
    console.log(`[Sync] No stale records to clean up in ${table}`)
    return
  }

  console.log(`[Sync] Cleaning up ${staleSlugs.length} stale records in ${table}:`, staleSlugs)

  // 3. Delete those specific slugs
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .in('slug', staleSlugs)

  if (deleteError) {
    console.error(`[Sync] Failed to delete stale records from ${table}:`, deleteError.message)
  } else {
    console.log(`[Sync] Successfully cleaned up stale records from ${table}`)
  }
}

async function sync() {
  console.log('Starting safe synchronization...')
  
  // 1a. Fetch ONLY published/live records to upsert to Supabase
  const publishedProtocols = await fetchAllNotionPages(env.NOTION_BLOG_DB_ID, {
    property: 'Status',
    status: { equals: 'Published' }
  })
  
  const liveTools = await fetchAllNotionPages(env.NOTION_TOOLS_DB_ID, {
    property: 'Status',
    status: { does_not_equal: 'Draft' }
  })
  
  const branchesDbId = env.NOTION_BRANCHES_DB_ID || 'bf1e89a5167e484b9fc85376031f72e3';
  const branchesData = await fetchAllNotionPages(branchesDbId);
  
  if (publishedProtocols.length === 0 && liveTools.length === 0 && branchesData.length === 0) {
    console.error('[Sync] No data retrieved from Notion. Aborting sync to prevent data loss.')
    return
  }

  // 1b. Fetch ALL records from Notion (regardless of status) just for stale-cleanup reference.
  // This ensures we ONLY delete articles/tools that no longer exist in Notion at all,
  // NOT articles that simply have a Draft/Unpublished status.
  const allProtocols = await fetchAllNotionPages(env.NOTION_BLOG_DB_ID)
  const allTools = await fetchAllNotionPages(env.NOTION_TOOLS_DB_ID)

  const allProtocolSlugs = allProtocols.map(p => getText(p.properties.Slug) || p.id).filter(Boolean)
  const allToolSlugs = allTools.map(p => getText(p.properties.Slug) || p.id).filter(Boolean)

  // 2. Upsert only published/live records
  const syncedProtocolSlugs = await syncProtocols(publishedProtocols)
  const syncedToolSlugs = await syncTools(liveTools)
  const syncedBranchSlugs = await syncBranches(branchesData)

  // 3. Delete ONLY records that no longer exist anywhere in Notion (not just unpublished ones)
  await deleteStaleRecords('protocols', allProtocolSlugs)
  await deleteStaleRecords('tools', allToolSlugs)
  await deleteStaleRecords('branches', syncedBranchSlugs)
  
  console.log('All syncs complete successfully!')
  console.log(`[Sync] Published protocols on site: ${syncedProtocolSlugs.length}`)
  console.log(`[Sync] Live tools on site: ${syncedToolSlugs.length}`)
}

sync().catch(console.error)
