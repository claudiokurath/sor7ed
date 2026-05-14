import { Client as NotionClient } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';

// ---------- Helper: load .env variables ----------
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    env[key.trim()] = rest.join('=').trim();
  }
});

const NOTION_TOKEN = env['NOTION_TOKEN'] || env['NOTION_API_KEY'];
// Use the page ID from the URL if not provided in env
const MASTER_DOC_ID = env['NOTION_MASTER_DOC_ID'] || '9666e231-30a7-4548-9764-4aec28cc4213';
if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN (or NOTION_API_KEY) in .env.local');
  process.exit(1);
}

const notion = new NotionClient({ auth: NOTION_TOKEN });

// ---------- Gather Tech Stack ----------
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};
const topDeps = Object.entries({ ...dependencies, ...devDependencies })
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(0, 10) // keep list short for readability
  .map(([name, version]) => `${name}: ${version}`);

// ---------- Gather Deployment Info ----------
let deploymentUrl = env['NEXT_PUBLIC_SITE_URL'] || '';
try {
  const vercelConfig = JSON.parse(fs.readFileSync('.vercel/project.json', 'utf8'));
  if (vercelConfig?.productionUrl) deploymentUrl = `https://${vercelConfig.productionUrl}`;
} catch (_) {}

// ---------- Gather Key Pages ----------
function walkDir(dir: string, filelist: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // skip node_modules, .git, etc.
      if (['node_modules', '.git', 'dist', 'out', 'public'].includes(file)) return;
      walkDir(full, filelist);
    } else if (file === 'page.tsx' || file === 'page.jsx' || file === 'page.ts' || file === 'page.js') {
      filelist.push(full);
    }
  });
  return filelist;
}

const pageFiles = walkDir('app');
const routeFromFile = (file: string): string => {
  // Strip the leading 'app' and '/page.tsx'
  let rel = path.relative('app', file);
  rel = rel.replace(/\/page\.[tj]sx?$/, '');
  // Convert index routes
  if (rel.endsWith('/index')) rel = rel.slice(0, -6);
  // Replace dynamic segments
  rel = rel.replace(/\[([^\]]+)\]/g, ':$1');
  return '/' + rel.replace(/\\/g, '/');
};

const pagesList = pageFiles.map(f => `${routeFromFile(f)}`).sort();

// ---------- Gather Core Components ----------
function listComponents(dir: string, list: string[] = []): string[] {
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'out'].includes(entry)) return;
      listComponents(full, list);
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts') || entry.endsWith('.jsx') || entry.endsWith('.js')) {
      list.push(path.relative('.', full));
    }
  });
  return list;
}

const componentFiles = listComponents('components');

// ---------- Build Notion block payload ----------
const blocks: any[] = [];

// Header
blocks.push({
  object: 'block',
  type: 'heading_1',
  heading_1: { rich_text: [{ type: 'text', text: { content: 'SOR7ED Master Document – Auto‑Sync' } }] },
});

// Version / Maintainer (already present but we rebuild for completeness)
blocks.push({
  object: 'block',
  type: 'paragraph',
  paragraph: {
    rich_text: [
      { type: 'text', text: { content: `Version: ${packageJson.version}` } },
      { type: 'text', text: { content: ' | ' } },
      { type: 'text', text: { content: `Maintainer: ${env['MAINTAINER_EMAIL'] || 'claudio.kurath@gmail.com'}` } },
    ],
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

// Tech Stack heading
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Tech Stack' } }] },
});
// List dependencies
topDeps.forEach(dep => {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: dep } }] },
  });
});

// Key Pages heading
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Key Pages (Routes)' } }] },
});
pagesList.forEach(route => {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: route } }] },
  });
});

// Core Components heading
blocks.push({
  object: 'block',
  type: 'heading_2',
  heading_2: { rich_text: [{ type: 'text', text: { content: 'Core Components' } }] },
});
componentFiles.forEach(comp => {
  blocks.push({
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: [{ type: 'text', text: { content: comp } }] },
  });
});

// ---- Function to replace all children of the master doc ----
async function syncMasterDoc() {
  try {
    // Delete existing children (if any)
    const existing = await notion.blocks.children.list({ block_id: MASTER_DOC_ID });
    if (existing.results.length) {
      for (const child of existing.results) {
        await notion.blocks.delete({ block_id: (child as any).id });
      }
    }
    // Append new blocks
    await notion.blocks.children.append({ block_id: MASTER_DOC_ID, children: blocks });
    console.log('✅ Master document synced successfully.');
  } catch (err) {
    console.error('❌ Error syncing master document:', err);
  }
}

syncMasterDoc();
