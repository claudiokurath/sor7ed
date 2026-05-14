import { Client } from '@notionhq/client'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

// Manual env loading for script
const envContent = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

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
  return p.rich_text?.[0]?.plain_text || p.title?.[0]?.plain_text || '';
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

async function syncProtocols() {
  console.log('Fetching articles from Notion...')
  const response = await notion.databases.query({
    database_id: env.NOTION_BLOG_DB_ID,
    filter: {
      property: 'Status',
      status: {
        equals: 'Published'
      }
    }
  })

  console.log(`Found ${response.results.length} articles. Syncing to Supabase...`)

  for (const page of response.results as NotionPage[]) {
    const props = page.properties

    const data = {
      title: getText(props.Title),
      slug: getText(props.Slug) || page.id,
      branch: getSelect(props.Branch),
      keyword: getText(props['WhatsApp Trigger']),
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
      cover_image: getCover(page) || getText(props['Cover Image URL']) || getText(props['Cover Image']),
      related_assessments: getText(props['Related Assessments']) ? JSON.parse(getText(props['Related Assessments'])) : []
    }

    const { error } = await supabase.from('protocols').upsert(data, { onConflict: 'slug' })
    if (error) console.error(`Error syncing protocol "${data.title}":`, error.message)
    else console.log(`Synced protocol: ${data.title}`)
  }
}

async function syncTools() {
  console.log('Fetching tools from Notion...')
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
    filter: {
      property: 'Status',
      status: {
        does_not_equal: 'Draft'
      }
    }
  })

  console.log(`Found ${response.results.length} tools. Syncing to Supabase...`)

  for (const page of response.results as NotionPage[]) {
    const props = page.properties

    const rawQuestions = getText(props.Questions);
    const data = {
      name: getText(props.Name),
      slug: getText(props.Slug) || page.id,
      branch: getSelect(props.Branch),
      keyword: getText(props['WhatsApp Trigger']),
      tldr: getText(props['TL,:DR']) || getText(props['TL;DR']), // Handle potential typo
      description: getText(props['Blog Post']),
      long_description: getText(props['Long Description']),
      short_description: getText(props['Short Description']),
      featured: getCheckbox(props.Featured),
      questions: rawQuestions ? JSON.parse(rawQuestions) : [],
      color: getText(props.Color) || '#ffffff',
      meta_description: getText(props['Meta Description']),
      cover_image: getCover(page) || getText(props['Cover Image URL']) || getText(props['Cover Image']) || getFiles(props['Cover Image']),
      status: getStatus(props.Status) || 'Live'
    }

    const { error } = await supabase.from('tools').upsert(data, { onConflict: 'slug' })
    if (error) console.error(`Error syncing tool "${data.name}":`, error.message)
    else console.log(`Synced tool: ${data.name}`)
  }
}

async function sync() {
  console.log('Clearing existing data...')
  await supabase.from('protocols').delete().neq('slug', 'keep-it-safe-placeholder')
  await supabase.from('tools').delete().neq('slug', 'keep-it-safe-placeholder')
  
  await syncProtocols()
  await syncTools()
  console.log('All syncs complete!')
}

sync().catch(console.error)
