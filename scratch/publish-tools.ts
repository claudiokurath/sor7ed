import { Client } from '@notionhq/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY })

async function publishMissingTools() {
  const response = await notion.databases.query({
    database_id: env.NOTION_TOOLS_DB_ID,
  })

  const targetTools = [
    { branch: 'Be Connected', name: 'Boundary Script Generator' },
    { branch: 'Spend Smart', name: 'Impulse Purchase Delay Matrix' },
    { branch: 'Level Up', name: 'Notification Detox' }
  ]

  for (const target of targetTools) {
    const page = response.results.find((p: any) => {
      const name = p.properties.Name?.title?.[0]?.plain_text
      const branch = p.properties.Branch?.select?.name
      return name === target.name && branch === target.branch
    })

    if (page) {
      console.log(`Publishing ${target.name}...`)
      await notion.pages.update({
        page_id: page.id,
        properties: {
          Status: {
            status: { name: 'Published' }
          }
        }
      })
    } else {
      console.log(`Could not find ${target.name} for ${target.branch}`)
    }
  }
  console.log('Done.')
}

publishMissingTools()
