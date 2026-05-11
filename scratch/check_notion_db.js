const { Client } = require('@notionhq/client');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) env[key.trim()] = value.join('=').trim()
})

const notion = new Client({ auth: env.NOTION_API_KEY });

async function checkDb() {
  const db = await notion.databases.retrieve({ database_id: env.NOTION_BLOG_DB_ID });
  console.log('Properties:', Object.keys(db.properties));
  if (db.properties.Status) {
    console.log('Status options:', JSON.stringify(db.properties.Status, null, 2));
  }
}

checkDb().catch(console.error);
