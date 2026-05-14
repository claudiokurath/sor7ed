import { Client as NotionClient } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars (token)
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const NOTION_TOKEN = env['NOTION_TOKEN'] || env['NOTION_API_KEY'];
if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN (or NOTION_API_KEY) in .env.local');
  process.exit(1);
}

// This is the Concierge Service Consolidated Doc ID (extracted from the URL you provided)
const MASTER_DOC_ID = 'b9da4fefd62645e4aaae5d18bde321a5';

const notion = new NotionClient({ auth: NOTION_TOKEN });

// -------- Gather Tech Stack ----------
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
const topDeps = Object.entries(deps)
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(0, 12)
  .map(([name, version]) => `${name}: ${version}`);

// -------- Deployment URL ----------
let deploymentUrl = env['NEXT_PUBLIC_SITE_URL'] || '';
try {
  const vercelCfg = JSON.parse(fs.readFileSync('.vercel/project.json', 'utf8'));
  if (vercelCfg?.productionUrl) deploymentUrl = `https://${vercelCfg.productionUrl}`;
} catch (_) {}

// -------- Key Pages ----------
function walk(dir: string, list: string[] = []): string[] {
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.next', 'dist', 'out'].includes(e)) continue;
      walk(full, list);
    } else if (/page\.[tj]sx?$/.test(e)) {
      list.push(full);
    }
  }
  return list;
}
const pageFiles = walk('app');
const routeFromFile = (file: string): string => {
  let rel = path.relative('app', file);
  rel = rel.replace(/\/page\.[tj]sx?$/, '');
  if (rel.endsWith('/index')) rel = rel.slice(0, -6);
  rel = rel.replace(/\[([^\]]+)\]/g, ':$1');
  return '/' + rel.replace(/\\/g, '/');
};
const routes = pageFiles.map(routeFromFile).sort();

// -------- Core Components ----------
function listComponents(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.next', 'dist', 'out'].includes(e)) continue;
      listComponents(full, acc);
    } else if (/\.(tsx?|jsx?)$/.test(e)) {
      acc.push(path.relative('.', full));
    }
  }
  return acc;
}
const componentFiles = listComponents('components');

// ---------- Build Notion blocks ----------
const blocks: any[] = [];
// Header
blocks.push({
  object: 'block',
  type: 'heading_1',
  heading_1: { rich_text: [{ type: 'text', text: { content: 'SOR7ED Concierge Service – Auto Sync' } }] },
});
// Version
blocks.push({
  object: 'block',
  type: 'paragraph',
  paragraph: {
    rich_text: [{ type: 'text', text: { content: `Version: ${packageJson.version}` } }],
  },
});
// Deployment URL
if (deploymentUrl) {
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: `Production URL: ${deploymentUrl}` } }] },
  });
}
// Tech Stack heading + list
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Tech Stack' } }] },
});
for (const dep of topDeps) {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: dep } }] },
  });
}
// Key Pages heading + list
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Key Pages (Routes)' } }] },
});
for (const r of routes) {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: r } }] },
  });
}
// Core Components heading + list
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Core Components' } }] },
});
for (const c of componentFiles) {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: c } }] },
  });
}

async function sync() {
  try {
    // wipe existing children
    const existing = await notion.blocks.children.list({ block_id: MASTER_DOC_ID });
    for (const child of existing.results) {
      await notion.blocks.delete({ block_id: (child as any).id });
    }
    // append new blocks
    await notion.blocks.children.append({ block_id: MASTER_DOC_ID, children: blocks });
    console.log('✅ Concierge doc synced successfully');
  } catch (e) {
    console.error('❌ Sync failed', e);
  }
}

sync();
