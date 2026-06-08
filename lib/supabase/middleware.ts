import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { branches } from '@/lib/constants'

// ─── SECURITY CONFIGURATION ────────────────────────────────────
const PUBLIC_PATHS = [
  '/login',
  '/auth', 
  '/tools',
  '/bridge',
  '/intelligence',
  '/articles',
  '/explore',  // 7 branches page — public
  '/r',  // Rich link redirects
  '/s',  // Save card redirects
  '/statement-v2.html',
  '/statement-v2',
];

// Only specific API routes should be public - never blanket '/api'
const PUBLIC_API_ROUTES = [
  '/api/webhook/stripe',
  '/api/webhook/whatsapp',
  '/api/search',
  '/api/cron/sync-notion',
  '/api/cron/weekly-broadcast',
];

const AUTH_PAGES = ['/login', '/signup', '/auth'];

// Static asset patterns for performance bypass
const STATIC_PATTERNS = /\.(ico|png|jpg|jpeg|webp|svg|gif|css|js|woff|woff2|ttf|map)$/;

function isPublicPath(pathname: string): boolean {
  // Always allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    STATIC_PATTERNS.test(pathname)
  ) {
    return true;
  }

  // Check homepage and signup
  if (pathname === '/' || pathname === '/signup') {
    return true;
  }

  // Check public API routes with safety guard against path confusion
  if (PUBLIC_API_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )) {
    return true;
  }

  // Check public paths with safety guard against path confusion
  if (PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )) {
    return true;
  }

  // Check branch paths with safety guard against path confusion
  if (branches?.length > 0) {
    return branches.some(branch => 
      pathname === `/${branch.slug}` || pathname.startsWith(`/${branch.slug}/`)
    );
  }

  return false;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Early exit for static assets - major performance optimization
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    STATIC_PATTERNS.test(pathname)
  ) {
    return NextResponse.next({ request });
  }

  // Supabase client setup - DO NOT MODIFY this cookie handling pattern
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: No logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = isPublicPath(pathname);

  // Redirect authenticated users away from auth pages
  if (user && AUTH_PAGES.some(page => pathname === page || pathname.startsWith(`${page}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';

    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
    return response;
  }

  // Redirect unauthenticated users to signup with preserved destination
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/signup';
    
    // Preserve intended destination (security: only for non-auth pages)
    if (!AUTH_PAGES.some(page => pathname === page || pathname.startsWith(`${page}/`))) {
      url.searchParams.set('redirect', pathname);
    }

    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
    return response;
  }

  // IMPORTANT: Must return supabaseResponse for session cookies
  return supabaseResponse;
}