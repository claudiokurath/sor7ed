import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import IntelligenceClient from "@/components/IntelligenceClient";
import { resolveOgImageUrl } from "@/lib/og-image";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

/**
 * Cached protocol fetching function.
 * React automatically deduplicates calls within the same request,
 * eliminating duplicate database queries between generateMetadata and the page component.
 */
const getProtocol = cache(async (slug: string) => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published') // Critical: prevents draft content exposure
    .single();

  if (error) {
    console.error(`[Intelligence] Failed to fetch protocol "${slug}":`, error.message);
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
  const article = await getProtocol(slug);

  if (!article) {
    return { 
      title: 'Intelligence Not Found | SOR7ED',
      description: 'This intelligence briefing could not be found.',
    };
  }

  const pageUrl = `${SITE_URL}/intelligence/${slug}`;
  
  // Fallback chain for description with field names matching your database schema
  const description = article.meta_description || 
                     article.problem || 
                     article.excerpt || 
                     `Field Intelligence briefing on ${article.title}.`;

  const resolvedImage = resolveOgImageUrl(article.cover_image, SITE_URL);

  return {
    title: `${article.title} | SOR7ED`,
    description,
    alternates: {
      canonical: pageUrl, // SEO: prevents duplicate content penalties
    },
    openGraph: {
      title: article.title,
      description,
      url: pageUrl,
      siteName: 'SOR7ED',
      images: [{
        url: resolvedImage,
        width: 1200, // Standard OG dimensions for optimal social sharing
        height: 630,
        alt: article.title,
      }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [resolvedImage],
    },
  };
}

export default async function IntelligenceBriefing({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // This reuses the cached result from generateMetadata - no additional database query!
  const article = await getProtocol(slug);

  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[#080f11] text-white px-4 sm:px-6 py-16 sm:py-20 relative overflow-hidden transition-colors duration-500">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff7a45]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto pt-16 relative z-10">
        <IntelligenceClient article={article} />
      </div>
    </main>
  );
}
