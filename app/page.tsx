import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const BRANCHES = [
  { slug: "keep-going",   label: "Keep Going",    emoji: "⚡", desc: "Energy, momentum, getting unstuck" },
  { slug: "spend-smart",  label: "Spend Smart",   emoji: "💷", desc: "Money clarity without the shame" },
  { slug: "feel-good",    label: "Feel Good",     emoji: "🌿", desc: "Rest, body, nervous system" },
  { slug: "plan-ahead",   label: "Plan Ahead",    emoji: "🗓", desc: "Structure that actually works" },
  { slug: "be-connected", label: "Be Connected",  emoji: "🤝", desc: "Relationships, communication" },
  { slug: "be-yourself",  label: "Be Yourself",   emoji: "🪞", desc: "Identity, self-knowledge" },
  { slug: "level-up",     label: "Level Up",      emoji: "🚀", desc: "Skills, growth, work" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, branch, short_description, cover_image")
    .neq("status", "Draft")
    .order("created_at", { ascending: false })
    .limit(6);

  const articles = posts ?? [];
  const toolList = tools ?? [];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#080f11]">
          <img
            src="/Images/home/hero.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-30 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080f11] via-[#080f11]/30 to-transparent" />
          {/* Teal ambient */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#00C4C4]/6 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#E8453C]/5 blur-[100px] pointer-events-none" />
        </div>

        <div className="relative page-container pb-20 pt-32">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="tag tag-accent">ND-first</span>
              <span className="tag">WhatsApp-delivered</span>
              <span className="tag">No app needed</span>
            </div>

            <h1 className="t-hero mb-6 text-balance">
              Life admin,{" "}
              <span className="text-[#00C4C4]">actually</span>{" "}
              sorted.
            </h1>

            <p className="t-body max-w-xl mb-10 text-lg">
              Practical protocols for neurodivergent adults — delivered straight to WhatsApp. No app, no overwhelm.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/tools" className="btn btn-accent btn-lg">
                Browse Tools →
              </Link>
              <Link href="/explore" className="btn btn-ghost btn-lg">
                See 7 Branches
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="t-label">scroll</span>
          <div className="w-px h-8 bg-[#f0ede8]/40" />
        </div>
      </section>

      {/* ── 7 BRANCHES CAROUSEL ────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-[#00C4C4] mb-2">The system</p>
              <h2 className="t-display">7 Branches</h2>
            </div>
            <Link href="/explore" className="btn btn-ghost btn-sm hidden md:inline-flex">
              All branches →
            </Link>
          </div>

          {/* Horizontal scroll carousel */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {BRANCHES.map((b) => (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className="flex-shrink-0 w-56 card p-5 flex flex-col gap-3 hover:border-[#00C4C4]/40 transition-colors duration-200 group"
              >
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className="t-heading text-sm mb-1 group-hover:text-[#00C4C4] transition-colors">{b.label}</p>
                  <p className="t-small">{b.desc}</p>
                </div>
                <span className="t-label text-[#00C4C4] opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                  Explore →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link href="/explore" className="btn btn-ghost btn-sm">All branches →</Link>
          </div>
        </div>
      </section>

      {/* ── BLOG ───────────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-[#00C4C4] mb-2">Read</p>
              <h2 className="t-display">Blog</h2>
            </div>
            <Link href="/intelligence" className="btn btn-ghost btn-sm hidden md:inline-flex">
              All posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {articles.map((post) => (
              <Link
                key={post.slug}
                href={`/intelligence/${post.slug}`}
                className="group bg-[#080f11] flex flex-col overflow-hidden hover:bg-[#0d1619] transition-colors duration-200"
              >
                {/* Image — even rectangle 16:9 */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619]">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="t-label opacity-30">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className="tag tag-accent self-start">{post.branch}</span>
                  <h3 className="t-heading text-sm line-clamp-2 group-hover:text-[#00C4C4] transition-colors">{post.title}</h3>
                  {post.summary && <p className="t-small line-clamp-2">{post.summary}</p>}
                  <span className="t-label mt-auto opacity-60">{post.read_time ? `${post.read_time} min read` : ""}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/intelligence" className="btn btn-ghost btn-sm">All posts →</Link>
          </div>
        </div>
      </section>

      {/* ── TOOLS ──────────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-[#E8453C] mb-2">Use</p>
              <h2 className="t-display">Tools</h2>
            </div>
            <Link href="/tools" className="btn btn-ghost btn-sm hidden md:inline-flex">
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {toolList.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-[#080f11] flex flex-col overflow-hidden hover:bg-[#0d1619] transition-colors duration-200"
              >
                {/* Image — even rectangle 16:9 */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619]">
                  {tool.cover_image ? (
                    <img
                      src={tool.cover_image}
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="t-label opacity-30">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <span className="tag self-start" style={{ borderColor: "rgba(232,69,60,0.25)", color: "#E8453C", background: "rgba(232,69,60,0.08)" }}>{tool.branch}</span>
                  <h3 className="t-heading text-sm line-clamp-2 group-hover:text-[#E8453C] transition-colors">{tool.name}</h3>
                  {tool.short_description && <p className="t-small line-clamp-2">{tool.short_description}</p>}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/tools" className="btn btn-ghost btn-sm">All tools →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container text-center">
          <h2 className="t-display mb-6">Ready to get sorted?</h2>
          <p className="t-body max-w-md mx-auto mb-8">
            Start with one branch. Everything is delivered to WhatsApp — no sign-up required.
          </p>
          <Link href="/tools" className="btn btn-accent btn-lg">
            Get started →
          </Link>
        </div>
      </section>
    </>
  );
}
