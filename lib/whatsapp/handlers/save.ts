import { createClient } from '@/lib/supabase/server';
import { generateShortId } from '@/lib/utils/shortid';
import { fetchExternalOg } from '@/lib/og/fetch-og';
import type { WaResponse } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export async function handleSave(
  userWaId: string, 
  input: string
): Promise<WaResponse> {
  const supabase = await createClient();
  
  // Determine if input is URL or slug
  const isUrl = input.startsWith('http://') || input.startsWith('https://');
  
  let title = input;
  let description = 'Saved from SOR7ED';
  let ogImageUrl = `${SITE_URL}/og-default.png`;
  let targetUrl = `${SITE_URL}/tools/${input}`;
  let type: 'tool' | 'blog' | 'external' = 'tool';
  let sourceId: string | undefined = input;
  let sourceUrl: string | undefined;

  if (isUrl) {
    // Handle external URLs
    type = 'external';
    sourceId = undefined;
    sourceUrl = input;
    targetUrl = input;
    
    // Fetch OG tags for external URLs
    const og = await fetchExternalOg(input);
    title = og.title ?? input;
    description = og.description ?? 'Saved from SOR7ED';
    ogImageUrl = og.image ?? ogImageUrl;
  } else {
    // Try to resolve as tool slug first
    const { data: tool } = await supabase
      .from('tools')
      .select('name, slug, description, cover_image')
      .eq('slug', input)
      .single();

    if (tool) {
      type = 'tool';
      title = tool.name;
      description = tool.description ?? description;
      ogImageUrl = tool.cover_image ?? ogImageUrl;
      targetUrl = `${SITE_URL}/tools/${tool.slug}`;
    } else {
      // Try as article slug
      const { data: article } = await supabase
        .from('protocols')
        .select('title, slug, summary, cover_image')
        .eq('slug', input)
        .single();

      if (article) {
        type = 'blog';
        title = article.title;
        description = article.summary ?? description;
        ogImageUrl = article.cover_image ?? ogImageUrl;
        targetUrl = `${SITE_URL}/intelligence/${article.slug}`;
      }
    }
  }

  // Check for existing save (idempotency)
  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_wa_id', userWaId)
    .eq(isUrl ? 'source_url' : 'source_id', isUrl ? sourceUrl : sourceId)
    .single();

  const shortId = existing?.id ?? generateShortId();

  // Create new save record if doesn't exist
  if (!existing) {
    await supabase.from('saved_items').insert({
      id: shortId,
      user_wa_id: userWaId,
      type,
      source_id: sourceId,
      source_url: sourceUrl,
      title,
      description,
      og_image_url: ogImageUrl,
      target_url: targetUrl,
    });
  }

  const cardUrl = `${SITE_URL}/s/${shortId}`;

  return {
    to: userWaId,
    text: `SAVED ✓ ${title}\n\nOpen: ${cardUrl}`,
    url: cardUrl,
    preview_url: true,
  };
}
