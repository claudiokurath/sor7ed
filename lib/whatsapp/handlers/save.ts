import { createAdminClient } from '@/lib/supabase/admin';
import { fetchExternalOg } from '@/lib/og/fetch-og';
import type { WaResponse } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export async function handleSave(
  userWaId: string, 
  input: string
): Promise<WaResponse> {
  const supabase = createAdminClient();
  
  // Determine if input is URL or slug
  const isUrl = input.startsWith('http://') || input.startsWith('https://');
  
  let title = input;
  let targetUrl = `${SITE_URL}/#tools`;
  let category = 'Tool';
  let toolData: any = null;
  let articleData: any = null;

  if (isUrl) {
    category = 'External';
    targetUrl = input;
    
    // Fetch OG tags for external URLs
    const og = await fetchExternalOg(input);
    title = og.title ?? input;
  } else {
    // Try to resolve as tool slug first
    const { data: tool } = await supabase
      .from('tools')
      .select('name, slug, cover_image, short_description')
      .eq('slug', input)
      .single();

    if (tool) {
      category = 'Tool';
      title = tool.name;
      targetUrl = `${SITE_URL}/#tools`;
      toolData = tool;
    } else {
      // Try as article slug
      const { data: article } = await supabase
        .from('protocols')
        .select('title, slug, cover_image, summary, tldr')
        .eq('slug', input)
        .single();

      if (article) {
        category = 'Article';
        title = article.title;
        targetUrl = `${SITE_URL}/#intelligence`;
        articleData = article;
      }
    }
  }

  // 1. Resolve user_id from phone number (with or without plus prefix)
  const { data: profile } = await supabase
    .from('users')
    .select('user_id')
    .or(`whatsapp_number.eq.+${userWaId},whatsapp_number.eq.${userWaId}`)
    .maybeSingle();

  const userId = profile?.user_id || null;

  // 2. Check for existing save (idempotency)
  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('url', targetUrl)
    .or(`phone.eq.+${userWaId},phone.eq.${userWaId}`)
    .maybeSingle();

  let savedId = existing?.id;

  // 3. Create new save record if doesn't exist
  if (!existing) {
    const { data: inserted, error } = await supabase
      .from('saved_items')
      .insert({
        user_id: userId,
        phone: `+${userWaId}`,
        url: targetUrl,
        title,
        category,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Webhook] Failed to insert saved_item:', error.message);
    } else if (inserted) {
      savedId = inserted.id;
    }
  }

  // 4. Create/upsert a matching rich link so that /s/[id] previews and redirects work
  if (savedId) {
    let description = `${category} saved to SOR7ED`;
    let imageUrl = `${SITE_URL}/Images/banners/landing%20banner.png`;

    // Try to find the correct tool or article details if we didn't query them from input slug (e.g. if input was an URL)
    let finalTool = toolData;
    let finalArticle = articleData;

    if (category === 'Tool' && finalTool) {
      description = finalTool.short_description || description;
      if (finalTool.cover_image && !finalTool.cover_image.includes('cdn.midjourney.com')) {
        imageUrl = finalTool.cover_image;
      }
    } else {
      // If we saved via a direct slug, we might already have the article fetched
      const articleToUse = finalArticle;
      if (category === 'Article' && articleToUse) {
        description = articleToUse.summary || articleToUse.tldr || description;
        if (articleToUse.cover_image && !articleToUse.cover_image.includes('cdn.midjourney.com')) {
          imageUrl = articleToUse.cover_image;
        }
      }
    }

    try {
      const { error: richLinkError } = await supabase
        .from('rich_links')
        .upsert({
          slug: savedId,
          title,
          description,
          target_url: targetUrl,
          image_url: imageUrl,
        }, { onConflict: 'slug' });

      if (richLinkError) {
        console.error('[Webhook] Failed to insert rich_link for saved_item:', richLinkError.message);
      }
    } catch (e) {
      console.error('[Webhook] Exception inserting rich_link for saved_item:', e);
    }
  }

  const cardUrl = `${SITE_URL}/s/${savedId}`;

  return {
    to: userWaId,
    text: `${title}\n${cardUrl}`,
    url: cardUrl,
    preview_url: true,
  };
}
