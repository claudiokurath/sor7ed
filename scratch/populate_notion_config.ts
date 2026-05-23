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

const configs = [
  {
    name: 'Homepage Background Color',
    key: 'home_bg_color',
    color: '#080f11',
    text: '',
    desc: 'Main background color of the homepage.'
  },
  {
    name: 'Homepage Primary Accent Color',
    key: 'home_accent_color',
    color: '#00C4C4',
    text: '',
    desc: 'Primary brand accent color (teal).'
  },
  {
    name: 'Homepage Secondary Accent Color',
    key: 'home_accent_sec_color',
    color: '#E8453C',
    text: '',
    desc: 'Secondary brand accent color (red).'
  },
  {
    name: 'Homepage Hero Title',
    key: 'home_hero_title',
    color: '',
    text: 'Life admin, actually sorted.',
    desc: 'The main title text displayed in the hero section.'
  },
  {
    name: 'Homepage Hero Subtitle',
    key: 'home_hero_subtitle',
    color: '',
    text: 'Practical protocols for neurodivergent adults — delivered straight to WhatsApp. No app, no overwhelm.',
    desc: 'The subtitle paragraph text in the hero section.'
  }
]

async function run() {
  console.log(`Adding config items to Notion database ${databaseId}...`)
  
  for (const item of configs) {
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
        'Text Value': {
          rich_text: [
            {
              text: {
                content: item.text,
              },
            },
          ],
        },
        Color: {
          rich_text: [
            {
              text: {
                content: item.color,
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
    console.log(`Added config: ${item.name}`)
  }
  
  console.log('Database population completed!')
}

run().catch(console.error)
