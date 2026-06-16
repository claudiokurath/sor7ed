import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { resolveOgImageUrl } from '@/lib/og-image';
import type { Metadata } from 'next';
import type { RichLink } from '@/types/rich-links';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

// Cached to prevent duplicate queries between generateMetadata and page component
const getRichLink = cache(async (slug: string): Promise<RichLink | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('rich_links')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`[RichLink] Failed to fetch slug "${slug}":`, error.message);
    return null;
  }

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const link = await getRichLink(slug);

  if (!link) {
    return { 
      title: 'Link Not Found | SOR7ED',
      description: 'This rich link could not be found.',
    };
  }

  const pageUrl = `${SITE_URL}/r/${slug}`;
  const description = link.description || 'Visit SOR7ED';
  const resolvedImage = resolveOgImageUrl(link.image_url);

  return {
    title: `${link.title} | SOR7ED`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: link.title,
      description,
      url: pageUrl,
      siteName: 'SOR7ED',
      images: [{ 
        url: resolvedImage, 
        width: 1200, 
        height: 630, 
        alt: link.title 
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: link.title,
      description,
      images: [resolvedImage],
    },
  };
}

export default async function RichLinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await getRichLink(slug); // Reuses cached result

  if (!link) notFound();

  // Async click tracking - don't block redirect
  const supabase = await createClient();
  (async () => {
    try {
      const { error } = await supabase.from('rich_link_clicks').insert({
        link_id: link.id,
        user_agent: 'Server Redirect',
      });
      if (error) {
        console.error('[RichLink] Click tracking failed:', error.message);
      }
    } catch (e) {
      console.error('[RichLink] Click tracking exception:', e);
    }
  })();

  redirect(link.target_url);
}
