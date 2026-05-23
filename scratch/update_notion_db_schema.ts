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

async function run() {
  console.log(`Updating schema for database ${databaseId}...`)
  
  await notion.databases.update({
    database_id: databaseId,
    title: [
      {
        type: 'text',
        text: {
          content: 'Site Config & Assets',
        },
      },
    ],
    properties: {
      // Add 'Text Value' and 'Color' fields to give style power
      'Text Value': {
        rich_text: {},
      },
      Color: {
        rich_text: {},
      }
    },
  })
  
  console.log('Database schema updated successfully to Site Config & Assets!')
}

run().catch(console.error)
