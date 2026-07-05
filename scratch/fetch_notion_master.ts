import { Client } from '@notionhq/client'
import * as fs from 'fs'

function loadEnvironment(): Record<string, string> {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  envContent.split('\n').forEach(line => {
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

async function main() {
  const pageId = '76a331bcf20142189cca0edad254405f'
  try {
    console.log(`Fetching page metadata for ID ${pageId}...`)
    const page = await notion.pages.retrieve({ page_id: pageId })
    console.log('Page Title/Metadata:', JSON.stringify(page, null, 2))

    console.log('\nFetching block children...')
    const blocks = await notion.blocks.children.list({ block_id: pageId })
    console.log(`Retrieved ${blocks.results.length} blocks.`)
    console.log('First 5 blocks:', JSON.stringify(blocks.results.slice(0, 5), null, 2))
  } catch (err: any) {
    console.error('Error fetching page from Notion:', err.message || err)
  }
}

main()
