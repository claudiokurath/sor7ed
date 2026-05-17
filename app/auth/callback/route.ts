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
  const rawNext = requestUrl.searchParams.get('next') ?? '/dashboard';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(error.message)}`, request.url));
    }

    if (user?.email) {
      console.log('✅ Auth callback: session exchanged for', user.email);
      // Link the auth user to their row in the users table
      const adminClient = getAdminClient();
      const { error: updateError } = await adminClient
        .from('users')
        .update({ user_id: user.id })
        .eq('email', user.email.toLowerCase().trim());

      if (updateError) {
        console.error('Error linking user profile:', updateError);
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
