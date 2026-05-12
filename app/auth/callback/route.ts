import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      const { error: updateError } = await supabase
        .from('users')
        .update({ user_id: user.id })
        .eq('email', user.email.toLowerCase().trim());
        
      if (updateError) {
        console.error('Error linking user profile:', updateError);
      }
    }
    
    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(error.message)}`, request.url));
    }
  }

  // Redirect to dashboard after successful sign-in
  return NextResponse.redirect(new URL(next, request.url));
}
