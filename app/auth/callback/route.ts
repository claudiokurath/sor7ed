import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const getAdminClient = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rawNext = requestUrl.searchParams.get('next') ?? '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(error.message)}`, request.url));
    }

    if (user?.email) {
      console.log('✅ Auth callback: session exchanged for', user.email);
      const adminClient = getAdminClient();
      const email = user.email.toLowerCase().trim();

      const { data: existing } = await adminClient
        .from('users')
        .select('user_id')
        .eq('email', email)
        .single();

      if (existing) {
        // Email/magic-link signup: link auth user to existing profile row
        await adminClient.from('users').update({ user_id: user.id }).eq('email', email);
      } else {
        // OAuth signup (Google): create profile row from Google metadata
        const meta = user.user_metadata ?? {};
        await adminClient.from('users').insert({
          user_id: user.id,
          email,
          first_name: meta.given_name ?? meta.name?.split(' ')[0] ?? null,
        });
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
