/**
 * Checks if a trimmed line is formatted in Title Case.
 */
function isTitleCase(str: string): boolean {
  // Trim and remove any leading numbers/dashes/bullet points, e.g. "1. ", "- ", etc.
  const cleaned = str.replace(/^[-•*\d\s\.)]+/, '').trim();
  if (cleaned.length === 0) return false;

  // Headings shouldn't end with a period, exclamation, or question mark
  if (/[.!?]$/.test(cleaned)) return false;

  // Split into words
  const words = cleaned.split(/[\s\‑-]+/);
  if (words.length === 0) return false;

  // Check if first word starts with capital
  const firstWord = words[0];
  if (!/^[A-Z]/.test(firstWord)) return false;

  const connectorWords = new Set([
    'for', 'and', 'the', 'in', 'of', 'to', 'with', 'on', 'at', 'by', 'a', 'an', 'is', 'or', 'about', 'vs', 'its'
  ]);

  // Check the rest of the words
  for (let i = 1; i < words.length; i++) {
    const word = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (!word) continue;
    
    // If it's a connector word, it can be lowercase
    if (connectorWords.has(word.toLowerCase())) {
      continue;
    }

    // Otherwise, it must start with an uppercase letter or be a number
    if (!/^[A-Z0-9]/.test(word)) {
      return false;
    }
  }

  return true;
}

/**
 * Formats a block of text to ensure headings/subtitles (short ALL CAPS lines,
 * Title Case lines, or lines ending with a colon) are cleanly separated from
 * the next block of text by a double newline (\n\n). This allows the frontend
 * renderer (splitting on \n{2,}) to properly detect and style them as headings.
 */
export function formatHeadings(text: string): string {
  if (!text) return '';
  
  // Preprocess: Fix run-in headings concatenated during Notion rich-text segment joining
  let cleaned = text;

  // Pattern 1: lowercase/number + punctuation + uppercase title/heading + newline
  // e.g. "cost.Expected Results\n" or "themselves.THE QUIET REBEL'S...\n"
  // Allows small lowercase connector words in the heading.
  const runInRegex1 = /([a-z0-9][.!?])([A-Z][A-Z\s’'‑-]{3,}|[A-Z][a-z]+(?:\s+(?:[A-Z][a-z]+|for|and|the|in|of|to|with|on|at|by|a|an|is|or|about|vs|its))+)(?=\s*\r?\n)/g;
  cleaned = cleaned.replace(runInRegex1, '$1\n\n$2');

  // Pattern 2: uppercase letter directly followed by STEP/PHASE + number
  // e.g. "GUIDESTEP 1" -> "GUIDE\n\nSTEP 1"
  const runInRegex2 = /([A-Z])(STEP\s*\d+|PHASE\s*\d+)\b/g;
  cleaned = cleaned.replace(runInRegex2, '$1\n\n$2');

  const lines = cleaned.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    result.push(lines[i]);
    
    if (line.length > 0) {
      const isHeading = 
        line.length < 80 && 
        (line === line.toUpperCase() || line.endsWith(':') || isTitleCase(line)) && 
        !/^[-•*]\s/.test(line) && 
        !/^\d+[\.\)]\s/.test(line);
        
      if (isHeading) {
        // If the next line exists and is not empty, insert an empty line to force double newline separation
        if (i + 1 < lines.length && lines[i + 1].trim() !== '') {
          result.push('');
        }
      }
    }
  }
  return result.join('\n');
}

/**
 * Normalizes and cleans a blog post body from Notion, removing duplicate titles
 * and ensuring correct spacing for subtitles/headings.
 */
export function cleanBlogPost(text: string, title: string): string {
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

  return formatHeadings(cleaned);
}

/**
 * Cleans the protocol instructions field from Notion, removing the redundant
 * title/header (typically "THE ... PROTOCOL") and formatting headings.
 */
export function cleanProtocolField(text: string, title: string): string {
  if (!text) return '';

  let cleaned = text.trim();
  
  // Split into lines to inspect the first line
  const lines = cleaned.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if the first line is a title header matching "[optional THE] ... PROTOCOL"
    const isProtocolTitle = 
      firstLine.length < 150 && 
      /^(THE\s+)?(.+?)\s+PROTOCOL$/i.test(firstLine);
      
    if (isProtocolTitle) {
      // Remove the first line and any leading empty lines/formatting characters
      lines.shift();
      cleaned = lines.join('\n').trim();
    }
  }

  // Clean up any remaining leading formatting characters/newlines
  cleaned = cleaned.replace(/^[:\-–—\s\n]+/, '').trim();
  
  return formatHeadings(cleaned);
}

/**
 * Clean markdown wrapper or leading json text from Notion templates.
 */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  // Remove markdown block wraps if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9]*\n/, '').replace(/\n```$/, '');
  } else if (cleaned.startsWith('json')) {
    cleaned = cleaned.substring(4).trim();
  }
  return cleaned.trim();
}

/**
 * Parses dynamic Notion template strings into uniform question definitions.
 */
export function parseTemplateToQuestions(templateStr: string): any[] {
  if (!templateStr || templateStr.trim() === '') return [];
  const cleaned = cleanJsonString(templateStr);
  // Most "Template" values are free-form notes, not JSON — only treat it as a
  // parse failure worth logging if it actually looks like it was meant to be JSON.
  const looksLikeJson = cleaned.startsWith('{') || cleaned.startsWith('[');
  try {
    const parsed = JSON.parse(cleaned);
    
    let rawFields: any[] = [];
    if (parsed.fields && Array.isArray(parsed.fields)) {
      rawFields = parsed.fields;
    } else if (typeof parsed === 'object' && parsed !== null) {
      // It's an object map structure (like noise-sensitivity-mixer)
      rawFields = Object.entries(parsed).map(([key, val]: [string, any]) => {
        return {
          id: key,
          ...val
        };
      });
    }

    // Filter out readonly fields
    const activeFields = rawFields.filter(f => !f.readonly);

    // Map each field to a uniform question structure
    return activeFields.map(f => {
      const id = String(f.id || '');
      const text = f.label || f.text || '';
      
      // Resolve input type
      let type = 'text';
      if (f.type === 'slider' || f.slider !== undefined || f.inputType === 'slider' || f.dataType === 'slider') {
        type = 'slider';
      } else if (f.type === 'toggle' || f.toggle !== undefined || f.inputType === 'toggle' || f.dataType === 'toggle') {
        type = 'toggle';
      } else if (f.type === 'number' || f.inputType === 'number' || f.dataType === 'number') {
        type = 'number';
      } else if (f.type === 'textarea' || f.inputType === 'textarea' || f.dataType === 'textarea') {
        type = 'textarea';
      } else if (f.type === 'select' || f.options !== undefined) {
        type = 'select';
      } else if (f.type === 'input') {
        type = f.subtype || 'text';
      } else if (f.type) {
        type = f.type;
      }

      // Resolve default value
      let defaultValue = f.default !== undefined ? f.default : f.defaultValue;
      if (defaultValue === undefined) {
        if (f.slider !== undefined) {
          defaultValue = f.slider;
        } else if (f.toggle !== undefined) {
          defaultValue = f.toggle;
        } else if (type === 'slider' || type === 'number') {
          defaultValue = f.min !== undefined ? Number(f.min) : 0;
        } else if (type === 'toggle') {
          defaultValue = false;
        } else if (type === 'select') {
          defaultValue = f.options && f.options.length > 0 ? f.options[0] : '';
        } else {
          defaultValue = '';
        }
      }

      return {
        id,
        text,
        type,
        min: f.min !== undefined ? Number(f.min) : undefined,
        max: f.max !== undefined ? Number(f.max) : undefined,
        step: f.step !== undefined ? Number(f.step) : undefined,
        options: Array.isArray(f.options) ? f.options : undefined,
        defaultValue,
        placeholder: f.placeholder || '',
        required: f.required !== undefined ? !!f.required : false
      };
    });
  } catch (err) {
    if (looksLikeJson) {
      console.error('[parseTemplateToQuestions] Error parsing template:', err);
    }
    return [];
  }
}

