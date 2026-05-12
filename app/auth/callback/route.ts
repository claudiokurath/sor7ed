import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user?.email) {
      // Link the authenticated user to their record in the 'users' table
      await supabase
        .from('users')
        .update({ user_id: user.id })
        .eq('email', user.email.toLowerCase().trim());
    }
  }

  // Redirect to tools after successful sign-in
  return NextResponse.redirect(new URL('/tools', requestUrl.origin));
}
