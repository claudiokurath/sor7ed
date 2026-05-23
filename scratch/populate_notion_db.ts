import { Client } from '@notionhq/client'
import * as fs from 'fs'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) return
    const key = trimmed.substring(0, equalIndex).trim()
    const value = trimmed.substring(equalIndex + 1).trim()
    if (key) env[key] = value
  })
  return env
}

const env = loadEnvironment()
const notion = new Client({ auth: env.NOTION_API_KEY })

const databaseId = '3670d601-4acc-8137-a1e3-daf1e0bdfa51'

const items = [
  {
    name: 'Homepage Hero',
    key: 'home_hero',
    desc: 'Background image for the hero section on the landing page.'
  },
  {
    name: 'Intelligence Hero',
    key: 'intelligence_hero',
    desc: 'Hero image displayed at the top of the Intelligence/Blog index page.'
  },
  {
    name: 'OG Explore Image',
    key: 'og_explore',
    desc: 'Default Open Graph preview image used for social sharing and link previews.'
  }
]

async function run() {
  console.log(`Populating database ${databaseId}...`)
  
  for (const item of items) {
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: item.name,
              },
            },
          ],
        },
        Key: {
          rich_text: [
            {
              text: {
                content: item.key,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: item.desc,
              },
            },
          ],
        },
        Active: {
          checkbox: true,
        },
      },
    })
    console.log(`Added: ${item.name}`)
  }
  
  console.log('Database population completed!')
}

run().catch(console.error)
