import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
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
    // Validate and consume token
    const { data: sessionData, error } = await supabaseAdmin
      .from('whatsapp_sessions')
      .select('*')
      .eq('token', token)
      .eq('consumed', false)
      .gt('expires_at', new Date().toISOString())
      .single();

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

    // Create redirect URL with session context
    const targetUrl = new URL(sessionData.target_url, process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com');
    targetUrl.searchParams.set('wa', '1');
    targetUrl.searchParams.set('phone', sessionData.phone);
    targetUrl.searchParams.set('keyword', sessionData.source_keyword || '');

    return NextResponse.redirect(targetUrl.toString());

  } catch (error) {
    console.error('Bridge error:', error);
    return NextResponse.redirect(
      new URL('/?error=bridge_error', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sor7ed.com')
    );
  }
}
