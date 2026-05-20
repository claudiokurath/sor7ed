import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { branches } from "@/lib/constants";

const PROBLEMS = [
  { text: "Can't start", href: "/plan-ahead", branch: "Plan Ahead" },
  { text: "Running on empty", href: "/feel-good", branch: "Feel Good" },
  { text: "Money avoidance", href: "/spend-smart", branch: "Spend Smart" },
  { text: "Can't focus", href: "/level-up", branch: "Level Up" },
  { text: "Can't sleep", href: "/feel-good", branch: "Feel Good" },
  { text: "Hard conversations", href: "/be-connected", branch: "Be Connected" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time, keyword")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(4);

  const articles = posts ?? [];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-16 min-h-[90dvh] flex flex-col justify-center border-b border-border-subtle">
        <div className="page-container py-20">
          <div className="max-w-4xl stagger">
            <div className="flex items-center gap-2 mb-8">
              <span className="tag tag-accent">ND-first</span>
              <span className="tag">WhatsApp-delivered</span>
              <span className="tag">No app needed</span>
            </div>

            <h1 className="t-hero mb-8 text-balance">
              Templates,{" "}
              <span className="relative">
                not
                <span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-accent"
                  aria-hidden="true"
                />
              </span>{" "}
              inspiration.
            </h1>

            <p className="t-body text-pretty max-w-2xl mb-10 text-lg">
              Neurodivergent-first tools and templates — delivered via WhatsApp —
              for the moments when starting is the hardest part.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/tools" className="btn btn-primary btn-lg">
                Browse tools
              </Link>
              <a
                href="https://wa.me/447591922247?text=HI"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <span aria-hidden="true">💬</span>
                Text us on WhatsApp
              </a>
            </div>

            <p className="t-label mt-6 text-ink-tertiary">
              Free · 7 areas of life · Built for executive dysfunction
            </p>
          </div>
        </div>
      </section>

      {/* Problem Picker */}
      <section className="border-b border-border-subtle">
        <div className="page-container">
          <div className="py-6 flex items-center justify-between gap-4 border-b border-border-subtle">
            <p className="t-label">What's stopping you?</p>
            <Link href="/tools" className="t-label hover:text-ink transition-colors">
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Link
                key={p.text}
                href={p.href}
                className={`group flex items-center justify-between px-4 py-6 hover:bg-surface-subtle transition-colors
                  ${i % 2 === 0 ? "border-r border-border-subtle md:border-r-0" : ""}
                  ${i % 3 !== 2 ? "md:border-r border-border-subtle" : ""}
                  ${i < 4 ? "border-b border-border-subtle" : ""}
                `}
              >
                <div>
                  <p className="t-label mb-1 text-ink-tertiary">{p.branch}</p>
                  <p className="t-heading">{p.text}</p>
                </div>
                <span
                  className="text-ink-disabled group-hover:text-ink group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {articles.length > 0 && (
        <section className="border-b border-border-subtle">
          <div className="page-container">
            <div className="py-6 flex items-center justify-between gap-4 border-b border-border-subtle">
              <p className="t-label">Latest articles</p>
              <Link href="/intelligence" className="t-label hover:text-ink transition-colors">
                All articles →
              </Link>
            </div>

            <div className="py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map(article => (
                  <ArticleCard
                    key={article.slug}
                    {...article}
                    excerpt={article.summary}
                    variant="default"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7 Areas */}
      <section className="border-b border-border-subtle">
        <div className="page-container">
          <div className="py-6 flex items-center justify-between gap-4 border-b border-border-subtle">
            <p className="t-label">7 areas of life</p>
            <Link href="/explore" className="t-label hover:text-ink transition-colors">
              Explore all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {branches.map((branch, i) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className="group flex flex-col gap-3 p-5 border-r border-border-subtle last:border-r-0 hover:bg-surface-subtle transition-colors"
              >
                <span className="text-xl" aria-hidden="true">{branch.icon || "•"}</span>
                <div>
                  <p className="t-label mb-1 text-ink-tertiary">{branch.num}</p>
                  <p className="t-heading group-hover:text-ink-secondary transition-colors">
                    {branch.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border-subtle">
        <div className="page-container section-sm">
          <div className="max-w-xl mx-auto text-center mb-12">
            <p className="t-label text-accent mb-4">How it works</p>
            <h2 className="t-display">Three steps to sorted</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-subtle">
            {[
              { n: "01", title: "Pick your situation", body: "Tap what's stopping you — or choose from 7 areas of life." },
              { n: "02", title: "Answer 4 questions", body: "Short, targeted. Done in under 2 minutes." },
              { n: "03", title: "Get your plan", body: "Your personalised protocol arrives on WhatsApp. No app. No login." },
            ].map(step => (
              <div key={step.n} className="bg-surface p-8">
                <p className="font-display text-5xl text-ink-disabled mb-6 leading-none font-medium">
                  {step.n}
                </p>
                <h3 className="t-heading mb-3">{step.title}</h3>
                <p className="t-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ink">
        <div className="page-container py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="t-display text-surface mb-4">
              Ready to get sorted?
            </h2>
            <p className="t-body text-surface/60 max-w-sm">
              Free · WhatsApp-delivered · No app needed
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/tools" className="btn btn-accent btn-lg">
              Browse all tools
            </Link>
            <a
              href="https://wa.me/447591922247"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg bg-surface/10 text-surface border-surface/20 hover:bg-surface/20"
            >
              <span aria-hidden="true">💬</span>
              Text on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
