const { Client } = require('@notionhq/client');
const notion = new Client({ auth: '...' });
console.log('Notion keys:', Object.keys(notion));
if (notion.databases) {
  console.log('Notion databases keys:', Object.keys(notion.databases));
}
