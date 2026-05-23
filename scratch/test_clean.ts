import { createClient } from '@supabase/supabase-js'
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
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

function cleanBlogPost(text: string, title: string): string {
  if (!text) return '';
  if (!title) return text;

  // Helper to normalize text for prefix matching
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[\u2018\u2019’]/g, "'")
      .replace(/[\u201C\u201D“”]/g, '"')
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212\u2015‑–—]/g, '-')
      .replace(/\s+/g, '')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  };

  const normTitle = normalize(title);
  const normText = normalize(text);

  let cleaned = text;

  if (normText.startsWith(normTitle)) {
    let textIdx = 0;
    let titleIdx = 0;
    
    while (textIdx < text.length && titleIdx < normTitle.length) {
      const normChar = normalize(text[textIdx]);
      if (normChar === '') {
        textIdx++;
      } else if (normChar === normTitle[titleIdx]) {
        textIdx++;
        titleIdx++;
      } else {
        break;
      }
    }
    
    // Consume any trailing ignored characters (punctuation, parentheses, spaces) at the end of matched title
    while (textIdx < text.length && normalize(text[textIdx]) === '') {
      textIdx++;
    }
    
    cleaned = text.substring(textIdx).trim();
    cleaned = cleaned.replace(/^[:\-–—\s\n]+/, '').trim();
  }

  // Formatting pass: Fix subtitles/headings that were concatenated
  // Let's split by newline to see the blocks
  const lines = cleaned.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If the first line is all uppercase, relatively short (subtitle), and followed by a paragraph
    if (firstLine.length > 0 && firstLine.length < 80 && firstLine === firstLine.toUpperCase() && !firstLine.startsWith('-') && !firstLine.startsWith('•')) {
      if (lines.length > 1 && lines[1].trim() !== '') {
        // There is text on the second line with only a single newline between them.
        // We insert a blank line to ensure it is split as a separate block by split(/\n{2,}/)
        lines.splice(1, 0, '');
      }
    }
  }

  return lines.join('\n').trim();
}

async function main() {
  const { data: protocols, error } = await supabase
    .from('protocols')
    .select('slug, title, problem');

  if (error) {
    console.error('Error:', error);
    return;
  }

  for (const p of protocols || []) {
    console.log(`SLUG: ${p.slug}`);
    console.log(`ORIGINAL:`);
    console.log(p.problem ? p.problem.substring(0, 200) + '...' : 'EMPTY');
    
    const cleaned = cleanBlogPost(p.problem || '', p.title);
    console.log(`CLEANED:`);
    console.log(cleaned.substring(0, 300) + '...');
    console.log(`-----------------------------------------\n`);
  }
}

main().catch(console.error);
