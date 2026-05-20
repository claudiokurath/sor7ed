import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { resolveOgImageUrl } from '@/lib/og-image';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

/**
 * Cached rich link fetching function.
 * React automatically deduplicates database calls within the same request cycle
 * between generateMetadata and the page component.
 */
const getRichLink = cache(async (slug: string) => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('rich_links')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`[RichLink] Database error for slug ${slug}:`, error.message);
    return null;
  }

  return data;
});

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const link = await getRichLink(slug);
      
  if (!link) return { title: 'Link Not Found | SOR7ED' };

  const resolvedImageUrl = resolveOgImageUrl(link.image_url, SITE_URL);

  return {
    title: link.title,
    description: link.description || 'Visit SOR7ED',
    openGraph: {
      title: link.title,
      description: link.description || 'Visit SOR7ED',
      url: `${SITE_URL}/r/${slug}`,
      siteName: 'SOR7ED',
      images: [{ 
        url: resolvedImageUrl, 
        width: 1200, 
        height: 630, 
        alt: link.title 
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: link.title,
      description: link.description || 'Visit SOR7ED',
      images: [resolvedImageUrl],
    },
  };
}

export default async function RichLinkPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const link = await getRichLink(slug);

  if (!link) {
    notFound();
  }

  const supabase = await createClient();

  // Server-side click tracking
  try {
    await supabase.from('rich_link_clicks').insert({
      link_id: link.id,
      user_agent: 'Server Redirect'
    });
  } catch (e) {
    console.error('Failed to log click:', e);
  }

  // Perform the redirect
  redirect(link.target_url);
}
