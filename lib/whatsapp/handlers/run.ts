import { createAdminClient } from '@/lib/supabase/admin';
import type { WaResponse } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export async function handleRun(
  userWaId: string,
  toolSlug: string
): Promise<WaResponse> {
  const supabase = createAdminClient();

  // Resolve tool by slug or keyword
  const { data: tool } = await supabase
    .from('tools')
    .select('name, slug, keyword, cover_image, short_description')
    .or(`slug.eq.${toolSlug},keyword.ilike.${toolSlug}`)
    .single();

  const resolvedSlug = tool?.slug ?? toolSlug;
  const toolName = tool?.name ?? toolSlug;

  // Generate / Upsert rich link for the tool so WhatsApp preview bot can crawl it unauthenticated
  const linkSlug = `tool-${resolvedSlug}`;
  
  try {
    const { error: upsertError } = await supabase
      .from('rich_links')
      .upsert({
        slug: linkSlug,
        title: toolName,
        description: tool?.short_description || 'Answer a short diagnostic to get your personalized protocol.',
        target_url: `${SITE_URL}/#tools`,
        image_url: (tool?.cover_image && !tool.cover_image.includes('cdn.midjourney.com')) ? tool.cover_image : `${SITE_URL}/Images/banners/landing%20banner.png`
      }, { onConflict: 'slug' });

    if (upsertError) {
      console.error(`[RichLinks] Failed to upsert tool rich link:`, upsertError.message);
    }
  } catch (e) {
    console.error(`[RichLinks] Exception upserting tool rich link:`, e);
  }

  const toolUrl = `${SITE_URL}/r/${linkSlug}`;

  // For Phase 1, metering is bypassed/stubbed
  // A proper entitlement check will be added in Phase 4
  const runsUsed = 1;
  const runsLimit = 5;

  return {
    to: userWaId,
    text: `${toolName}\n${toolUrl}`,
    url: toolUrl,
    preview_url: true,
  };
}
