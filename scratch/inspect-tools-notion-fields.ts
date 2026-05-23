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

async function inspectSchema() {
  const dbId = '08ac767d-3138-45ca-9188-6ce45c379b99'
  const db = await notion.databases.retrieve({ database_id: dbId })
  console.log('Database Properties keys:')
  console.log(JSON.stringify(Object.keys(db.properties).sort(), null, 2))
}

inspectSchema().catch(console.error)
