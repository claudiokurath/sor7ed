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

const parentPageId = '9666e231-30a7-4548-9764-4aec28cc4213'

async function run() {
  console.log(`Creating 'Site Images' database under page ${parentPageId}...`)
  
  const response = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Site Images',
        },
      },
    ],
    properties: {
      Name: {
        title: {},
      },
      Key: {
        rich_text: {},
      },
      Image: {
        files: {},
      },
      Description: {
        rich_text: {},
      },
      Active: {
        checkbox: {},
      },
    },
  })
  
  console.log('Database created successfully!')
  console.log(`Database ID: ${response.id}`)
  console.log(`Database URL: ${response.url}`)
}

run().catch(console.error)
