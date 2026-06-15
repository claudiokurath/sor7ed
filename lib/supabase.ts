import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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

// Client-side Supabase client
export const createClient = () => createClientComponentClient();

// Server-side Supabase client
export const createServerClient = () => createServerComponentClient({ cookies });

// Helper functions for common database operations
export async function getPublishedProtocols(limit?: number) {
  const supabase = createServerClient();
  
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
  const supabase = createServerClient();
  
  return supabase
    .from('protocols')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single();
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient();
  
  return supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
}
