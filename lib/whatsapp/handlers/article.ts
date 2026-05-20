import { createAdminClient } from '@/lib/supabase/admin';
import type { WaResponse } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

function splitArticleContent(content: string, maxLength: number = 3000): string[] {
  if (!content) return [];
  const chunks: string[] = [];
  let currentChunk = '';

  const paragraphs = content.split('\n\n');
  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

export async function handleArticle(
  userWaId: string,
  articleSlug: string
): Promise<WaResponse[]> {
  const supabase = createAdminClient();

  // Resolve article by slug or keyword
  const { data: article } = await supabase
    .from('protocols')
    .select('title, slug, keyword, tldr, protocol')
    .or(`slug.eq.${articleSlug},keyword.ilike.${articleSlug}`)
    .single();

  if (!article) {
    return [{
      to: userWaId,
      text: "Article not found\nVisit sor7ed.com/intelligence",
      preview_url: false,
    }];
  }

  // Combine TL;DR and Protocol instructions
  const combinedContent = [
    article.tldr ? `*TL;DR*\n${article.tldr}` : '',
    article.protocol ? `*Protocol*\n${article.protocol}` : ''
  ].filter(Boolean).join('\n\n');

  // Chunk content to fit WhatsApp length limits
  const chunks = splitArticleContent(combinedContent || "No content available.");
  
  return chunks.map((chunk, index) => ({
    to: userWaId,
    text: index === 0 
      ? `${article.title}\n\n${chunk}` 
      : chunk,
    preview_url: index === 0, // Only first chunk might get preview if there's a link
  }));
}
