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
  let targetUrl = `${SITE_URL}/tools/${input}`;
  let category = 'Tool';

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
      .select('name, slug')
      .eq('slug', input)
      .single();

    if (tool) {
      category = 'Tool';
      title = tool.name;
      targetUrl = `${SITE_URL}/tools/${tool.slug}`;
    } else {
      // Try as article slug
      const { data: article } = await supabase
        .from('protocols')
        .select('title, slug')
        .eq('slug', input)
        .single();

      if (article) {
        category = 'Article';
        title = article.title;
        targetUrl = `${SITE_URL}/intelligence/${article.slug}`;
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

  const cardUrl = `${SITE_URL}/s/${savedId}`;

  return {
    to: userWaId,
    text: `${title}\n${cardUrl}`,
    url: cardUrl,
    preview_url: true,
  };
}
