import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — SOR7ED",
  description: "All the things your brain has been waiting for.",
};

const HERO_IMAGE = "/HERO.png";

export default async function IntelligencePage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) console.error("[IntelligencePage]", error.message);

  const articles = posts ?? [];

  return (
    <div className="min-h-screen bg-black">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[75vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
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
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            All the things your brain has been waiting for
          </h1>

          <p
            className="uppercase text-white/60 text-xs tracking-widest max-w-md leading-relaxed mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Most mental health content wasn&apos;t written for people who forget
            to drink water, not people who forget they&apos;re human.
          </p>

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
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/intelligence/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-3">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>
              <p className="text-white text-sm font-medium leading-tight group-hover:text-[#2dd4bf] transition-colors">
                {article.title}
              </p>
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
