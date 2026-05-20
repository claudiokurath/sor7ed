import { createAdminClient } from '@/lib/supabase/admin';
import type { WaResponse } from '@/types/whatsapp';

export async function handleLibrary(userWaId: string): Promise<WaResponse> {
  const supabase = createAdminClient();

  const { data: items } = await supabase
    .from('saved_items')
    .select('title, url')
    .or(`phone.eq.+${userWaId},phone.eq.${userWaId}`)
    .order('saved_at', { ascending: false })
    .limit(10);

  if (!items || items.length === 0) {
    return {
      to: userWaId,
      text: "No saved items\nVisit sor7ed.com/tools",
      preview_url: false,
    };
  }

  // List format: each item is title + link
  const itemsList = items
    .map(item => `${item.title}\n${item.url}`)
    .join('\n\n');

  return {
    to: userWaId,
    text: itemsList,
    preview_url: false, // Don't preview in lists
  };
}
