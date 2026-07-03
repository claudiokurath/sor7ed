import { createAdminClient } from '@/lib/supabase/admin';
import type { WaResponse } from '@/types/whatsapp';
import { randomBytes } from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export async function handleLogin(userWaId: string): Promise<WaResponse> {
  const supabase = createAdminClient();

  // Find user by phone number
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email, first_name')
    .or(`whatsapp_number.eq.+${userWaId},whatsapp_number.eq.${userWaId}`)
    .maybeSingle();

  if (userError || !user) {
    console.warn(`[Login] User not found for phone: ${userWaId}`, userError?.message);
    return {
      to: userWaId,
      text: `We couldn't find an account matching your WhatsApp number.\n\nSign up first at ${SITE_URL}/signup`,
      preview_url: false,
    };
  }

  try {
    // Generate magic link via Supabase Auth Admin
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: `${SITE_URL}/dashboard`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[Login] Failed to generate magic link:', linkError?.message);
      return {
        to: userWaId,
        text: `Sorry, we failed to generate a login link. Please try logging in via the website at ${SITE_URL}/signup?mode=login`,
        preview_url: false,
      };
    }

    const actionLink = linkData.properties.action_link;
    const token = randomBytes(16).toString('hex');
    const slug = `login-${token}`;

    // Create a rich link for the magic link so the user gets a branded card
    const { error: richLinkError } = await supabase.from('rich_links').insert({
      slug,
      title: 'Login to SOR7ED',
      description: `Hey ${user.first_name || 'there'}! Tap here to log in directly to your dashboard.`,
      target_url: actionLink,
      image_url: `${SITE_URL}/Images/banners/landing%20banner.png`,
    });

    if (richLinkError) {
      console.error('[Login] Failed to create rich link for login:', richLinkError.message);
      // Fallback to sending the direct link
      return {
        to: userWaId,
        text: `Hey ${user.first_name || 'there'}! Tap here to log in directly to your dashboard:\n${actionLink}`,
        preview_url: false,
      };
    }

    const loginUrl = `${SITE_URL}/r/${slug}`;

    return {
      to: userWaId,
      text: `Hey ${user.first_name || 'there'}! Tap here to log in directly to your dashboard:\n${loginUrl}`,
      url: loginUrl,
      preview_url: true,
    };
  } catch (err: any) {
    console.error('[Login] Exception in handleLogin:', err);
    return {
      to: userWaId,
      text: `An error occurred while logging you in. Please visit the website to sign in: ${SITE_URL}/signup?mode=login`,
      preview_url: false,
    };
  }
}
