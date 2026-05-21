import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

const BRANCHES: Array<{ slug: string; label: string; emoji: string; desc: string }> = [
  { slug: "keep-going",   label: "Keep Going",    emoji: "⚡", desc: "Energy, momentum, getting unstuck" },
  { slug: "spend-smart",  label: "Spend Smart",   emoji: "💷", desc: "Money clarity without the shame" },
  { slug: "feel-good",    label: "Feel Good",     emoji: "🌿", desc: "Rest, body, nervous system" },
  { slug: "plan-ahead",   label: "Plan Ahead",    emoji: "🗓", desc: "Structure that actually works" },
  { slug: "be-connected", label: "Be Connected",  emoji: "🤝", desc: "Relationships, communication" },
  { slug: "be-yourself",  label: "Be Yourself",   emoji: "🪞", desc: "Identity, self-knowledge" },
  { slug: "level-up",     label: "Level Up",      emoji: "🚀", desc: "Skills, growth, work" },
];

export default async function HomePage() {
  const config = await getSiteConfig();
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

  const { data: branchesData } = await supabase
    .from("branches")
    .select("slug, name, icon, description, cover_image, color")
    .order("num", { ascending: true });

  const articles = posts ?? [];
  const toolList = tools ?? [];

  // Merge database branches with hardcoded emojis/details safely
  const branchList = (branchesData || []).map(b => {
    const hardcoded = BRANCHES.find(h => h.slug === b.slug);
    return {
      slug: b.slug,
      name: b.name || hardcoded?.label || "",
      icon: b.icon || hardcoded?.emoji || "⚡",
      description: b.description || hardcoded?.desc || "",
      cover_image: b.cover_image || `/Images/branches/${b.slug}.png`,
      color: b.color || "#00C4C4"
    };
  });

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-surface)' }}>
          <img
            src={config.home_hero?.image || "/Images/home/hero.jpg"}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="relative page-container pb-20 pt-32">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="tag tag-accent">ND-first</span>
              <span className="tag">WhatsApp-delivered</span>
              <span className="tag">No app needed</span>
            </div>

            <h1 className="t-hero mb-6 text-balance text-white">
              {renderFormattedText(config.home_hero_title?.text, 'var(--color-accent)')}
            </h1>

            <div className="t-body max-w-xl mb-10 text-lg text-white/60">
              {renderFormattedText(config.home_hero_subtitle?.text, 'var(--color-accent)')}
            </div>

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

      {/* ── 7 BRANCHES GRID ────────────────────────────────── */}
      <section className="section border-t border-border-subtle bg-surface-subtle/30">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-accent mb-2 font-mono tracking-widest">THE SYSTEM</p>
              <h2 className="t-display">7 Branches</h2>
            </div>
            <Link href="/explore" className="btn btn-ghost btn-sm hidden md:inline-flex border-white/10 hover:border-white">
              All branches →
            </Link>
          </div>

          {/* Branches Grid */}
          <div className="flex flex-col gap-6">
            {/* Top row (4 cards on desktop, grid on mobile) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {branchList.slice(0, 4).map((b) => (
                <Link
                   key={b.slug}
                   href={`/${b.slug}`}
                   className="group relative aspect-square border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
                >
                  {/* Image (Square 1:1, full color) */}
                  <img
                    src={b.cover_image}
                    alt={b.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Bottom details */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <div>
                      <p className="t-heading text-xs text-white font-bold mb-1">{b.name}</p>
                      <p className="text-[10px] text-white/80 line-clamp-1 leading-none">{b.description}</p>
                    </div>
                    <span className="text-accent font-bold text-sm shrink-0 ml-2">→</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom row (3 cards centered on desktop, grid on mobile) */}
            <div className="grid grid-cols-2 lg:flex lg:justify-center gap-6">
              {branchList.slice(4, 7).map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="group relative aspect-square lg:w-[calc(25%-18px)] border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
                >
                  {/* Image (Square 1:1, full color) */}
                  <img
                    src={b.cover_image}
                    alt={b.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Bottom details */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <div>
                      <p className="t-heading text-xs text-white font-bold mb-1">{b.name}</p>
                      <p className="text-[10px] text-white/80 line-clamp-1 leading-none">{b.description}</p>
                    </div>
                    <span className="text-accent font-bold text-sm shrink-0 ml-2">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG SECTION ─────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-accent mb-2">Read</p>
              <h2 className="t-display">Blog</h2>
            </div>
            <Link href="/intelligence" className="btn btn-ghost btn-sm hidden md:inline-flex">
              All posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post) => (
              <Link
                key={post.slug}
                href={`/intelligence/${post.slug}`}
                className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-accent/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container: aspect-video (16:9) to fit landscape images perfectly */}
                  <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#131e21]">
                        <span className="t-label opacity-30">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <span className="tag tag-accent bg-black/40 border-accent/20 text-[9px] px-1.5 py-0.5 self-start">{post.branch}</span>
                    <h3 className="t-heading text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2 uppercase">
                      {post.title}
                    </h3>
                    {post.summary && <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">{post.summary}</p>}
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest text-accent">
                    <span className="text-white/40 font-mono font-normal normal-case">{post.read_time ? `${post.read_time} min read` : ""}</span>
                    <span>READ PROTOCOL →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/intelligence" className="btn btn-ghost btn-sm w-full">All posts →</Link>
          </div>
        </div>
      </section>

      {/* ── TOOLS SECTION ────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle bg-surface-subtle/30">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="t-label text-coral mb-2">Use</p>
              <h2 className="t-display">Tools</h2>
            </div>
            <Link href="/tools" className="btn btn-ghost btn-sm hidden md:inline-flex">
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolList.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-coral/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container: aspect-video (16:9) to fit landscape tool images perfectly */}
                  <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                    {tool.cover_image ? (
                      <img
                        src={tool.cover_image}
                        alt={tool.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#131e21]">
                        <span className="t-label opacity-30">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <span className="tag bg-black/40 border-coral/20 text-coral text-[9px] px-1.5 py-0.5 self-start">{tool.branch}</span>
                    <h3 className="t-heading text-sm font-bold text-white group-hover:text-coral transition-colors leading-snug line-clamp-2 uppercase">
                      {tool.name}
                    </h3>
                    {tool.short_description && <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">{tool.short_description}</p>}
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest text-coral">
                    <span className="text-white/40 font-mono font-normal">INTERACTIVE</span>
                    <span>LAUNCH TOOL →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/tools" className="btn btn-ghost btn-sm w-full">All tools →</Link>
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
