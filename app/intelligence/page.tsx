import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

export const metadata: Metadata = {
  title: "Articles — SOR7ED",
  description: "All the things your brain has been waiting for.",
};

export default async function IntelligencePage() {
  const config = await getSiteConfig();
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) console.error("[IntelligencePage]", error.message);

  const articles = posts ?? [];

  const pageBg = config.intelligence_bg_color?.color || '#000000';
  const pageAccent = config.intelligence_accent_color?.color || '#00C4C4';
  const heroImage = config.intelligence_hero?.image || '/Images/banners/blog banner.png';

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
      <section className="relative w-full min-h-[75vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="SOR7ED — All the things your brain has been waiting for"
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>

        {/* Text content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20">
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl text-balance"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {renderFormattedText(config.intelligence_hero_title?.text, 'var(--color-accent)')}
          </h1>

          <div
            className="uppercase text-white/60 text-xs tracking-widest max-w-md leading-relaxed mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {renderFormattedText(config.intelligence_hero_subtitle?.text, 'var(--color-accent)')}
          </div>

          <p className="font-black uppercase text-white text-sm tracking-widest mb-5">
            SOR7ED is different.
          </p>

          <ul
            className="space-y-1.5 text-white/60 text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <li>• We write about the real stuff.</li>
            <li>• The stuff that gets left out of the NHS.</li>
            <li>• The quiet cost of pretending to be fine.</li>
          </ul>
        </div>
      </section>

      {/* ── ARTICLE GRID ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/intelligence/${article.slug}`}
              className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-accent/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image container: aspect-video (16:9) to fit landscape images perfectly */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#131e21]">
                      <span className="t-label opacity-30">No Image</span>
                    </div>
                  )}
                </div>

                {/* Text box */}
                <div className="p-5 flex flex-col gap-2">
                  <span className="tag tag-accent bg-black/40 border-accent/20 text-[10px] self-start">{article.branch}</span>
                  <h3 className="t-heading text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2 uppercase">
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
          <p className="text-white/40 text-sm">No articles published yet.</p>
        )}
      </div>
    </div>
  );
}
