import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { branches } from '@/lib/constants'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with sessions being lost.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ─── ROUTE PROTECTION LOGIC ──────────────────────────────────
  const pathname = request.nextUrl.pathname;

  const publicPaths = [
    '/login', 
    '/auth', 
    '/tools', 
    '/bridge', 
    '/api', 
    '/intelligence', 
    ...branches.map(b => `/${b.slug}`)
  ];

  const isPublic =
    pathname === '/' ||
    pathname === '/signup' ||
    publicPaths.some(p => pathname.startsWith(p));

  if (!user && !isPublic) {
    // No user, redirect to signup page
    const url = request.nextUrl.clone()
    url.pathname = '/signup'
    
    const response = NextResponse.redirect(url)
    
    // Copy over the refreshed cookies to the redirect response
    supabaseResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie)
    })
    return response
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is
  return supabaseResponse
}