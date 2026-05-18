"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { branches } from "@/lib/constants";
import SaveToPhoneButton from "@/components/SaveToPhoneButton";

type FeaturedArticle = {
  slug: string;
  title: string;
  branch: string;
  summary: string;
  tldr: string;
  excerpt: string;
  cover_image: string;
  read_time: string;
};

const PROBLEMS = [
  { text: "Too much to do",    sub: "Overwhelm",  href: "/plan-ahead"   },
  { text: "Running on empty",  sub: "Burnout",    href: "/feel-good"    },
  { text: "Money stress",      sub: "Finance",    href: "/spend-smart"  },
  { text: "Can't focus",       sub: "Attention",  href: "/level-up"     },
  { text: "Can't sleep",       sub: "Rest",       href: "/feel-good"    },
  { text: "Hard conversation", sub: "Conflict",   href: "/be-connected" },
];

export default function HomeClient({ featuredArticles = [] }: { featuredArticles?: FeaturedArticle[] }) {
  const hero = featuredArticles[0];
  const secondary = featuredArticles.slice(1, 3);

  return (
    <div>

      {/* ── HERO — full-screen black problem picker ── */}
      <section className="bg-black flex flex-col" style={{ minHeight: "100dvh" }}>

        {/* Mobile logo */}
        <div className="md:hidden px-6 pt-8 pb-0 shrink-0">
          <span className="font-display text-xl tracking-widest text-white uppercase">
            SOR<span className="text-ps-yellow">7</span>ED
          </span>
        </div>

        {/* Headline */}
        <div className="px-6 md:px-12 pt-8 md:pt-24 pb-6 shrink-0 flex items-end justify-between gap-4">
          <motion.h1
            className="font-display uppercase leading-[0.9] text-white"
            style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            What&apos;s{" "}
            <span style={{ color: "#FFD107" }}>stopping</span>{" "}
            <span style={{ WebkitTextStroke: "2px #fff", color: "transparent" }}>you?</span>
          </motion.h1>
          <motion.p
            className="hidden md:block text-white/20 text-[10px] font-display uppercase tracking-[0.2em] text-right shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Tap a problem<br />to get started
          </motion.p>
        </div>

        {/* Problem tiles */}
        <div className="flex-1 grid grid-cols-2 border-t-2 border-white/10">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className={`
                ${i % 2 === 0 ? "border-r-2 border-white/10" : ""}
                ${i < 4 ? "border-b-2 border-white/10" : ""}
              `}
            >
              <Link
                href={p.href}
                className="group flex flex-col justify-between p-5 md:p-8 h-full hover:bg-ps-yellow active:bg-ps-yellow transition-colors duration-150"
              >
                <div>
                  <p className="text-white/25 group-hover:text-black/40 text-[9px] font-display uppercase tracking-[0.2em] mb-2 transition-colors">
                    {p.sub}
                  </p>
                  <span
                    className="font-display uppercase text-white group-hover:text-black leading-tight transition-colors"
                    style={{ fontSize: "clamp(1rem, 3.5vw, 1.5rem)" }}
                  >
                    {p.text}
                  </span>
                </div>
                <span className="text-white/20 group-hover:text-black transition-colors self-end text-xl">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="shrink-0 border-t-2 border-white/10 px-6 md:px-12 py-3 flex items-center justify-between">
          <span className="text-white/20 text-[9px] font-display uppercase tracking-[0.2em]">
            7 areas · 4 questions · under 2 min · free
          </span>
          <Link href="/tools" className="text-white/20 hover:text-white text-[9px] font-display uppercase tracking-[0.2em] transition-colors">
            Browse all →
          </Link>
        </div>
      </section>

      {/* ── FEATURED ARTICLES — editorial, white ─── */}
      {featuredArticles.length > 0 && (
        <section className="bg-white border-b-2 border-black">
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <div className="px-5 sm:px-8 md:px-12 py-4 border-b-2 border-black flex items-center justify-between">
              <p className="label">From the Field</p>
              <Link href="/intelligence" className="label hover:text-black transition-colors">All articles →</Link>
            </div>

            {/* Editorial grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3">

              {/* Hero article — 2 columns wide */}
              {hero && (
                <div className="lg:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col">
                  {hero.cover_image ? (
                    <div className="h-56 sm:h-72 lg:h-80 img-zoom border-b-2 border-black">
                      <img
                        src={hero.cover_image}
                        alt={hero.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-56 sm:h-72 lg:h-80 bg-black border-b-2 border-black flex items-end p-8">
                      <span className="font-display text-6xl text-white/10 uppercase">{hero.branch}</span>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6 sm:p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="label-yellow">{hero.branch}</span>
                      {hero.read_time && (
                        <span className="text-black/35 text-[9px] font-display uppercase tracking-wider">{hero.read_time} min read</span>
                      )}
                    </div>
                    <h2
                      className="font-display uppercase text-black leading-tight mb-4 flex-1"
                      style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
                    >
                      {hero.title}
                    </h2>
                    <p className="text-black/55 text-sm leading-relaxed line-clamp-3 mb-6">
                      {hero.summary || hero.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t-2 border-black pt-5 mt-auto">
                      <Link
                        href={`/intelligence/${hero.slug}`}
                        className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
                      >
                        Read article →
                      </Link>
                      <SaveToPhoneButton
                        title={hero.title}
                        summary={hero.summary || hero.excerpt || undefined}
                        pageUrl={`/intelligence/${hero.slug}`}
                        size="sm"
                        label="Save"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary articles — stacked in 1 column */}
              <div className="flex flex-col">
                {secondary.map((article, i) => (
                  <div
                    key={article.slug}
                    className={`flex flex-col flex-1 ${i === 0 ? "border-b-2 border-black" : ""}`}
                  >
                    {article.cover_image && (
                      <div className="h-36 img-zoom border-b-2 border-black">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-6">
                      <span className="label-yellow mb-3 inline-block">{article.branch}</span>
                      <h3 className="font-display uppercase text-base text-black leading-tight mb-2 flex-1">
                        {article.title}
                      </h3>
                      <p className="text-black/50 text-xs leading-relaxed line-clamp-2 mb-4">
                        {article.summary || article.excerpt}
                      </p>
                      <div className="flex items-center justify-between border-t border-black/15 pt-4">
                        <Link
                          href={`/intelligence/${article.slug}`}
                          className="text-[10px] font-display uppercase tracking-widest text-black hover:text-ps-yellow transition-colors"
                        >
                          Read →
                        </Link>
                        <SaveToPhoneButton
                          title={article.title}
                          summary={article.summary || article.excerpt || undefined}
                          pageUrl={`/intelligence/${article.slug}`}
                          size="sm"
                          label="Save"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fill empty slots if fewer than 2 secondary articles */}
                {secondary.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <Link href="/intelligence" className="label hover:text-black transition-colors">
                      Browse all articles →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 7 AREAS — white ─────────────────────────── */}
      <section className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b-2 border-black flex items-center justify-between">
            <p className="label">7 areas of life</p>
            <Link href="/explore" className="label hover:text-black transition-colors">Explore all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {branches.map((branch, i) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className={`group block px-5 sm:px-6 py-7 hover:bg-black transition-colors border-black/10
                  ${i % 4 !== 3 ? "md:border-r" : ""}
                  ${i % 3 !== 2 ? "sm:border-r md:border-r-0" : ""}
                  ${i % 2 !== 1 ? "border-r sm:border-r-0" : ""}
                  ${i < branches.length - 4 ? "border-b" : ""}
                `}
              >
                <span className="text-2xl block mb-3">{branch.icon}</span>
                <p className="label mb-1 text-black/30 group-hover:text-white/30 transition-colors">{branch.num}</p>
                <h3 className="font-display uppercase text-sm tracking-wide text-black group-hover:text-white mb-1 transition-colors">
                  {branch.name}
                </h3>
                <p className="text-black/40 group-hover:text-white/40 text-xs leading-relaxed line-clamp-2 transition-colors">
                  {branch.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — yellow ────────────────────── */}
      <section className="bg-ps-yellow border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-black/15">
            <p className="label">How it works</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: "01", title: "Pick your situation",  body: "Tap what's stopping you — or choose a tool from 7 areas of life." },
              { n: "02", title: "Answer 4 questions",   body: "Short, targeted. Done in under 2 minutes." },
              { n: "03", title: "Get your plan",        body: "Your personalised protocol arrives on WhatsApp. No app. No login." },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`px-5 sm:px-8 md:px-12 py-10 ${i < 2 ? "border-b md:border-b-0 md:border-r border-black/15" : ""}`}
              >
                <div className="font-display text-6xl text-black/15 mb-4 leading-none">{s.n}</div>
                <h3 className="font-display uppercase text-base tracking-wide text-black mb-3">{s.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — black ───────────────────────────────── */}
      <section className="bg-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2
              className="font-display uppercase text-white leading-none mb-3"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}
            >
              Ready to get<br />sorted?
            </h2>
            <p className="text-white/30 text-xs font-display uppercase tracking-[0.2em]">
              Free · WhatsApp · No app needed
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/tools" className="btn-yellow">Explore all tools →</Link>
            <a
              href="https://wa.me/447591922247"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Text on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
