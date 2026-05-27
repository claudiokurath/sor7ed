// app/tools/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import ToolAssessmentClient from "@/components/ToolAssessmentClient";
import { Metadata } from "next";

// ✅ CORRECT: Keep Promise-based params for Next.js 15
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, tldr, branch, slug, cover_image')
    .eq('slug', resolvedParams.slug)
    .neq('status', 'Draft')
    .single();

  if (!tool) {
    return {
      title: 'Assessment Not Found | SOR7ED',
      description: 'This diagnostic could not be found. Try another one.',
      robots: { index: false }
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';
  const description = tool.description || tool.tldr ||
    `Find exactly what's broken in your ${tool.branch} system. Built by someone who's been there.`;
  const image = tool.cover_image || `${siteUrl}/Images/og-explore.png`;
  const pageUrl = `${siteUrl}/tools/${resolvedParams.slug}`;

  return {
    title: `${tool.name} | SOR7ED`,
    description,
    openGraph: {
      title: `${tool.name} | SOR7ED`,
      description,
      url: pageUrl,
      siteName: 'SOR7ED',
      images: [{ url: image, width: 1200, height: 630, alt: tool.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | SOR7ED`,
      description,
      images: [image],
    },
  };
}

// ─── SECURITY: INPUT SANITIZATION ─────────────────────────────
function sanitizeWhatsAppParams(searchParams: {
  wa?: string;
  keyword?: string;
}) {
  const isWhatsAppEntry = searchParams.wa === '1';

  if (!isWhatsAppEntry) return null;

  // Sanitize keyword: alphanumeric and hyphens only
  const cleanKeyword = (searchParams.keyword || '')
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .toLowerCase()
    .trim()
    .slice(0, 50);

  return {
    sourceKeyword: cleanKeyword,
    entryTime: new Date().toISOString()
  };
}

// ─── MAIN PAGE COMPONENT ───────────────────────────────────────
export default async function ToolPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ wa?: string; keyword?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  // Fetch user if exists (do not block guest access)
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tool, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .neq('status', 'Draft')
    .single();

  if (error || !tool) {
    console.error('Tool loading error:', error);
    notFound();
  }

  // ✅ SECURITY: Sanitize URL parameters
  const whatsappContext = sanitizeWhatsAppParams(resolvedSearchParams);

  return (
    <>
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={tool.cover_image || "/Images/banners/tools banner.png"}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">{tool.branch?.toUpperCase() || 'TOOL'}</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            {tool.name}
          </h1>
          {tool.tldr && (
            <p className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
              {tool.tldr}
            </p>
          )}
        </div>
      </section>

      <Suspense fallback={<ToolLoadingState toolName={tool.name} />}>
        <ToolAssessmentClient
          tool={tool}
          whatsappContext={whatsappContext}
        />
      </Suspense>
    </>
  );
}

// ─── PREMIUM NOIR LOADING STATE ────────────────────────────────
function ToolLoadingState({ toolName }: { toolName?: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-sm">
        {/* Animated diagnostic indicator */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-[#2dd4bf] rounded-full animate-spin" />
          <div className="absolute inset-2 bg-[#2dd4bf]/10 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#2dd4bf] rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-anton tracking-wider uppercase tracking-[0.3em] text-white/20">
            Loading Diagnostic
          </p>
          {toolName && (
            <h2 className="text-lg font-anton tracking-wider text-white uppercase">
              {toolName}
            </h2>
          )}
          <p className="text-white/40 text-sm font-roboto font-thin">
            Preparing your assessment...
          </p>
        </div>
      </div>
    </div>
  );
}
