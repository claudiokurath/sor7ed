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
      title: 'Article Not Found | SOR7ED',
      description: 'This article could not be found.',
    };
  }

  const pageUrl = `${SITE_URL}/intelligence/${slug}`;
  
  // Fallback chain for description with field names matching your database schema
  const description = article.meta_description || 
                     article.problem || 
                     article.excerpt || 
                     `Article on ${article.title}.`;

  const resolvedImage = resolveOgImageUrl(article.cover_image);

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

  // Use cover_image directly for visual banner — resolveOgImageUrl is for OG meta tags only
  const bannerImage = article.cover_image || '/Images/banners/blog banner.png';

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { const img = e.target as HTMLImageElement; const fallback = article.cover_image || '/Images/banners/blog%20banner.png'; if (img.src !== fallback) img.src = fallback; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">{article.branch?.toUpperCase() || 'ARTICLE'}</p>
          <h1
            className="font-display font-black uppercase text-white leading-none max-w-2xl"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.01em" }}
          >
            {article.title}
          </h1>
          {false && article.summary && (
            <p className="text-white/60 text-base leading-relaxed max-w-md" >
              {article.summary}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pb-20 relative z-10">
        <IntelligenceClient article={article} />
      </div>
    </main>
  );
}
