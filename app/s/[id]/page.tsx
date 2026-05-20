import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SaveCard } from '@/types/whatsapp';
import { cache } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

function extractSlugFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    return segments.at(-1) ?? null;
  } catch {
    console.warn(`[SaveCard] Invalid URL: ${url}`);
    return null;
  }
}

function resolveOgImageUrl(ogImageUrl: string, siteUrl: string): string {
  if (!ogImageUrl) return `${siteUrl}/og-default.png`;

  if (ogImageUrl.startsWith('http') && 
      !ogImageUrl.includes('/storage/v1/object/public/notion-files/')) {
    return ogImageUrl;
  }

  if (ogImageUrl.includes('/storage/v1/object/public/notion-files/')) {
    return ogImageUrl
      .replace(
        '/storage/v1/object/public/notion-files/',
        '/storage/v1/render/image/public/notion-files/'
      )
      + '?width=1200&height=630&resize=cover&quality=80&format=jpeg';
  }

  const cleanPath = ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`;
  return `${siteUrl}${cleanPath}`;
}

// Cached to prevent duplicate queries between generateMetadata and page component
const getSaveCardWithMetadata = cache(async (id: string) => {
  const supabase = await createClient();
  
  const { data: item, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return {
      item: null,
      description: 'Your saved item from SOR7ED.',
      ogImageUrl: '/og-default.png'
    };
  }

  let description = 'Saved from SOR7ED';
  let ogImageUrl = '/og-default.png';

  const slug = extractSlugFromUrl(item.url);
  if (slug) {
    if (item.category === 'Tool') {
      const { data: tool } = await supabase
        .from('tools')
        .select('short_description, cover_image')
        .eq('slug', slug)
        .single();
      if (tool) {
        description = tool.short_description || description;
        ogImageUrl = tool.cover_image || ogImageUrl;
      }
    } else if (item.category === 'Article') {
      const { data: article } = await supabase
        .from('protocols')
        .select('summary, cover_image')
        .eq('slug', slug)
        .single();
      if (article) {
        description = article.summary || description;
        ogImageUrl = article.cover_image || ogImageUrl;
      }
    }
  }

  return { item, description, ogImageUrl };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { item, description, ogImageUrl } = await getSaveCardWithMetadata(id);

  if (!item) {
    return {
      title: 'Saved on SOR7ED',
      description: 'Your saved item from SOR7ED.',
    };
  }

  const resolvedOgImageUrl = resolveOgImageUrl(ogImageUrl, SITE_URL);

  return {
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      url: `${SITE_URL}/s/${id}`,
      siteName: 'SOR7ED',
      images: [{
        url: resolvedOgImageUrl,
        width: 1200,
        height: 630,
        alt: item.title,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
      images: [resolvedOgImageUrl],
    },
  };
}

export default async function SaveCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { item } = await getSaveCardWithMetadata(id);

  if (!item) notFound();
  redirect(item.url);
}
