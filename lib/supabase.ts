import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type Protocol = {
  id: string;
  slug: string;
  title: string;
  branch: string;
  status: string;
  summary: string;
  excerpt: string;
  problem: string;
  cta: string;
  protocol: string;
  keyword: string;
  cover_image: string | null;
  read_time: string;
  meta_description: string;
  seo_title: string;
  updated_at: string;
};

export type UserProfile = {
  user_id: string;
  first_name: string | null;
  email: string;
  whatsapp_number: string | null;
  weekly_opted_in: boolean;
  whatsapp_opted_out: boolean;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const createClient = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side Supabase client
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createSSRServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
};

// Helper functions for common database operations
export async function getPublishedProtocols(limit?: number) {
  const supabase = await createServerClient();

  let query = supabase
    .from('protocols')
    .select('*')
    .eq('status', 'Published')
    .order('updated_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  return query;
}

export async function getProtocolBySlug(slug: string) {
  const supabase = await createServerClient();

  return supabase
    .from('protocols')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single();
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient();

  return supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
}
