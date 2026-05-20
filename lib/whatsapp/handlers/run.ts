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
    .select('name, slug, keyword')
    .or(`slug.eq.${toolSlug},keyword.ilike.${toolSlug}`)
    .single();

  const resolvedSlug = tool?.slug ?? toolSlug;
  const toolName = tool?.name ?? toolSlug;
  const toolUrl = `${SITE_URL}/tools/${resolvedSlug}`;

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
