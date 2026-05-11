const { Client } = require('@notionhq/client');
const notion = new Client({ auth: '...' });
if (notion.views) {
  console.log('Notion views keys:', Object.keys(notion.views));
}
