import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';
import { resolveOgImageUrl, DEFAULT_OG_IMAGE } from '@/lib/og-image';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

function extractSlugFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url, SITE_URL); // Base URL handles relative paths
    const segments = parsed.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    return segments.at(-1) ?? null;
  } catch (error) {
    console.warn(`[SaveCard] Invalid URL: ${url}`, error);
    return null;
  }
}

const getSaveCardWithMetadata = cache(async (id: string) => {
  const supabase = await createClient();
  
  const { data: item, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`[SaveCard] Database error for item ${id}:`, error.message);
  }

  if (error || !item) {
    return {
      item: null,
      description: 'Your saved item from SOR7ED.',
      ogImageUrl: DEFAULT_OG_IMAGE
    };
  }

  let description = 'Saved from SOR7ED';
  let ogImageUrl: string = DEFAULT_OG_IMAGE;

  const slug = extractSlugFromUrl(item.url);
  if (slug) {
    if (item.category === 'Tool') {
      const { data: tool } = await supabase
        .from('tools')
        .select('short_description, cover_image')
        .eq('slug', slug)
        .eq('status', 'Live') // Security: only published tools
        .single();
      if (tool) {
        description = tool.short_description || description;
        ogImageUrl = tool.cover_image || ogImageUrl;
      }
    } else if (item.category === 'Article') {
      const { data: article } = await supabase
        .from('protocols')
        .select('summary, cover_image, meta_description')
        .eq('slug', slug)
        .eq('status', 'Published') // Security: only published articles
        .single();
      if (article) {
        description = article.meta_description || article.summary || description;
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

  const resolvedOgImageUrl = resolveOgImageUrl(ogImageUrl);

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
