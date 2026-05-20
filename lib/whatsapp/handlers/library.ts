import { createClient } from '@/lib/supabase/server';
import type { WaResponse } from '@/types/whatsapp';

export async function handleLibrary(userWaId: string): Promise<WaResponse> {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('saved_items')
    .select('title, target_url')
    .eq('user_wa_id', userWaId)
    .order('created_at', { ascending: false })
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
    .map(item => `${item.title}\n${item.target_url}`)
    .join('\n\n');

  return {
    to: userWaId,
    text: itemsList,
    preview_url: false, // Don't preview in lists
  };
}
