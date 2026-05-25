import { createAdminClient } from '@/lib/supabase/admin';
import type { WaResponse } from '@/types/whatsapp';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export async function handleWelcome(userWaId: string): Promise<WaResponse> {
  const supabase = createAdminClient();

  await supabase.from('rich_links').upsert({
    slug: 'welcome',
    title: 'Welcome to SOR7ED',
    description: 'Practical protocols for neurodivergent minds — delivered to your WhatsApp.',
    target_url: `${SITE_URL}/signup`,
    image_url: `${SITE_URL}/Images/Welcome.png`,
  }, { onConflict: 'slug' });

  const welcomeUrl = `${SITE_URL}/r/welcome`;

  return {
    to: userWaId,
    text: `Welcome to SOR7ED 👋\n${welcomeUrl}\n\nText a keyword to get started — or visit the link above to create your account.`,
    preview_url: true,
  };
}
