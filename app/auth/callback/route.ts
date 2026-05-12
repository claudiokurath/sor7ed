import { cookies } from 'next/headers';
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
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user?.email) {
      console.log('Successfully exchanged code for session for:', user.email);
      
      // Link the authenticated user to their record in the 'users' table
      // We use the Admin Client here to bypass RLS, as the user isn't linked yet
      const adminClient = getAdminClient();
      const { error: updateError } = await adminClient
        .from('users')
        .update({ user_id: user.id })
        .eq('email', user.email.toLowerCase().trim());
        
      if (updateError) {
        console.error('Error linking user profile with Admin Client:', updateError);
      }
    }
    
    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(error.message)}`, request.url));
    }
  }

  // Create the redirect response
  const response = NextResponse.redirect(new URL(next, request.url));

  // Failsafe: Manually copy all cookies from the cookie store to the redirect response.
  // This is the most reliable way to ensure the session sticks in Next.js Route Handlers.
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}
