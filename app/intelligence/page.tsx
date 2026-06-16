import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Articles — SOR7ED",
  description: "Practical articles for neurodivergent minds. Real insights, no fluff.",
};

export default async function IntelligencePage() {
  const config = await getSiteConfig();
  const supabase = createAdminClient();
  const { data: posts, error } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) console.error("[IntelligencePage]", error.message);

  const articles = posts ?? [];

  const pageBg = config.intelligence_bg_color?.color || '#000000';
  const pageAccent = config.intelligence_accent_color?.color || '#00C4C4';
  const heroImage = '/Images/banners/blog%20banner.png';

  const localStyle = {
    backgroundColor: pageBg,
    '--color-surface': pageBg,
    '--color-accent': pageAccent,
    '--color-accent-dim': pageAccent + '1a',
    '--color-accent-border': pageAccent + '40',
  } as React.CSSProperties;

  return (
    <div style={localStyle} className="min-h-screen transition-colors duration-500 pb-20">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label mb-3">ARTICLES</p>
          <h1
            className="font-display font-black uppercase leading-none max-w-2xl text-[#f1ece1]"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.01em" }}
          >
            {renderFormattedText(config.intelligence_hero_title?.text, 'white') || 'Intelligence'}
          </h1>

        </div>
      </section>

      {/* ── ARTICLE GRID ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/intelligence/${article.slug}`}
              className="group bg-[#0d1619] border border-[#2e2a22] overflow-hidden hover:border-accent/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image container: aspect-video (16:9) to fit landscape images perfectly */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                  <div className="w-full h-full bg-[#0d1619] flex items-center justify-center absolute inset-0">
                    <span className="t-label opacity-20 uppercase tracking-widest">{article.branch}</span>
                  </div>
                  {(article.cover_image || true) && (
                    <img
                      src={article.cover_image || `/Images/articles/${article.slug}.jpg`}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                    />
                  )}
                </div>

                {/* Text box */}
                <div className="p-5 flex flex-col gap-2">
                  <span className="tag tag-accent bg-black/40 border-accent/20 text-[10px] self-start">{article.branch}</span>
                  <h3 className="t-heading text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">
                      {article.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="p-5 pt-0 mt-auto">
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest text-accent">
                  <span className="text-white/40 font-mono font-normal normal-case">{article.read_time ? `${article.read_time} min read` : ""}</span>
                  <span>READ PROTOCOL →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="t-mono mt-2">No articles published yet.</p>
        )}
      </div>
    </div>
  );
}
