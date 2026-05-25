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

  const { data: branchesData } = await supabase
    .from("branches")
    .select("slug, name, icon, description, cover_image, color")
    .order("num", { ascending: true });

  // Merge database branches with hardcoded emojis/details safely
  const branchList = (branchesData || []).map(b => {
    const hardcoded = BRANCHES.find(h => h.slug === b.slug);
    return {
      slug: b.slug,
      name: b.name || hardcoded?.label || "",
      icon: b.icon || hardcoded?.emoji || "⚡",
      description: b.description || hardcoded?.desc || "",
      cover_image: b.cover_image || `/Images/members/${b.slug}.png`,
      color: b.color || "#00C4C4"
    };
  });

  return (
    <>
      <section className="relative min-h-[50vh] lg:min-h-[65vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-surface">
          <img
            src={config.home_hero?.image || "/Images/home/hero.jpg"}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          {/* Gradients to blend the background and ensure high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative page-container pb-12 pt-28 z-10 w-full">
          <div className="max-w-3xl">
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/Images/Logo2026.png"
                alt="SOR7ED Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="tag text-white border-white/20">ND-first</span>
              <span className="tag">WhatsApp-delivered</span>
              <span className="tag">No app needed</span>
            </div>

            <h1 className="t-hero mb-6 text-balance text-white">
              SKIP THE NONSENSE
            </h1>

            <div className="t-body max-w-xl mb-8 text-lg text-white/60">
              {renderFormattedText(config.home_hero_subtitle?.text, 'white')}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/tools" className="btn btn-lg" style={{ background: '#00C4C4', color: '#000', borderColor: '#00C4C4' }}>
                Browse Tools →
              </Link>
              <Link href="/intelligence" className="btn btn-lg" style={{ background: '#00C4C4', color: '#000', borderColor: '#00C4C4' }}>
                Read Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7 BRANCHES GRID ────────────────────────────────── */}
      <section className="section border-t border-border-subtle bg-surface-subtle/30">
        <div className="page-container lg:max-w-[1600px] xl:max-w-[1800px]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4 md:gap-6">
            {branchList.map((b) => (
              <div key={b.slug} className="flex flex-col items-center">
                <Link
                  href={`/${b.slug}`}
                  className="group relative w-full aspect-square border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
                >
                  {/* Image (Square 1:1, full color) */}
                  <img
                    src={b.cover_image}
                    alt={b.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                </Link>
                {/* Description under the box, no title */}
                <p className="text-[8px] sm:text-[10px] md:text-xs text-white/50 mt-2 text-center leading-tight font-sans">
                  {b.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 lg:hidden">
            <Link href="/explore" className="btn btn-ghost btn-sm w-full border-white/10 hover:border-white">
              All branches →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────────── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container text-center">
          <h2 className="t-display mb-6">Ready to get sor7ed?</h2>
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
