import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/?error=missing_token', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com')
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Validate and consume token
    const { data: sessionData, error } = await supabaseAdmin
      .from('whatsapp_sessions')
      .select('*')
      .eq('token', token)
      .eq('consumed', false)
      .gt('expires_at', new Date().toISOString())
      .single();
https://www.midjourney.com/jobs/6e7e8d48-37a4-4676-844d-d520669903c1?index=3
    if (error || !sessionData) {
      console.error('Invalid or expired bridge token:', token);
      return NextResponse.redirect(
        new URL('/?error=invalid_token', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com')
      );
    }

    // Mark token as consumed to prevent replay attacks
    await supabaseAdmin
      .from('whatsapp_sessions')
      .update({ consumed: true })
      .eq('id', sessionData.id);

    // Build target URL — phone is intentionally omitted to avoid PII in URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com';
    const toolUrl = new URL(sessionData.target_url, siteUrl);
    toolUrl.searchParams.set('wa', '1');
    toolUrl.searchParams.set('keyword', sessionData.source_keyword || '');

    // Check for existing user and auto-login
    try {
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('whatsapp_number', sessionData.phone)
        .single();

      if (userProfile?.email) {
        console.log(`Bridge: Found existing user ${userProfile.email}, generating auto-login link.`);

        const { data: authLink, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: userProfile.email,
          options: {
            redirectTo: toolUrl.toString()
          }
        });

        if (!linkError && authLink?.properties?.action_link) {
          return NextResponse.redirect(authLink.properties.action_link);
        } else {
          console.error('Bridge: Failed to generate magic link:', linkError);
        }
      }
    } catch {
      console.log('Bridge: No existing user found for this phone, proceeding as guest.');
    }

    // Fallback: redirect as guest
    return NextResponse.redirect(toolUrl.toString());

  } catch (error) {
    console.error('Bridge error:', error);
    return NextResponse.redirect(
      new URL('/?error=bridge_error', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com')
    );
  }
}
