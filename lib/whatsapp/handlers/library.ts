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
      text: 'Your library is empty. Save items using the SAVE command.',
    };
  }

  const text = items.map((i, idx) => `${idx + 1}. ${i.title}\n${i.target_url}`).join('\n\n');

  return {
    to: userWaId,
    text: `Your Saved Library (Recent 10):\n\n${text}`,
  };
}
