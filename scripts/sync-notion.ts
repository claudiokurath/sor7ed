import { Client } from '@notionhq/client'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

// Manual env loading for script
const envContent = fs.readFileSync('.env.local', 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function syncProtocols() {
  console.log('Fetching articles from Notion...')
  const response = await notion.databases.query({
    database_id: env.NOTION_BLOG_DB_ID,
    filter: {
      property: 'Status',
      status: {
        does_not_equal: 'Draft'
      }
    }
  })

  console.log(`Found ${response.results.length} articles. Syncing to Supabase...`)

  for (const page of response.results as any) {
    const props = page.properties
    const extractText = (prop: any) => prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || ''

    const data = {
      title: extractText(props.Title),
      slug: extractText(props.Slug) || page.id,
      branch: props.Branch?.select?.name || '',
      keyword: extractText(props['WhatsApp Trigger']),
      tldr: extractText(props['TL;DR']),
      problem: extractText(props['Blog Post']),
      protocol: extractText(props.Protocol),
      cta: extractText(props.CTA),
      excerpt: extractText(props.Excerpt),
      seo_title: extractText(props['SEO Title']),
      meta_description: extractText(props['Meta Description']),
      read_time: extractText(props['Read Time']),
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

  for (const page of response.results as any) {
    const props = page.properties
    const extractText = (prop: any) => prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || ''

    const data = {
      name: extractText(props.Name),
      slug: extractText(props.Slug) || page.id,
      branch: props.Branch?.select?.name || '',
      keyword: extractText(props['WhatsApp Trigger']),
      tldr: extractText(props['TL,:DR']) || extractText(props['TL;DR']), // Handle potential typo
      description: extractText(props['Blog Post']),
      meta_description: extractText(props['Meta Description']),
      cover_image: props['Cover Image']?.files?.[0]?.file?.url || props['Cover Image']?.files?.[0]?.external?.url || '',
    }

    const { error } = await supabase.from('tools').upsert(data, { onConflict: 'slug' })
    if (error) console.error(`Error syncing tool "${data.name}":`, error.message)
    else console.log(`Synced tool: ${data.name}`)
  }
}

async function sync() {
  await syncProtocols()
  await syncTools()
  console.log('All syncs complete!')
}

sync().catch(console.error)
