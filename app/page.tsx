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
      cover_image: `/Images/members/${b.slug}.png`,
      color: b.color || "#00C4C4"
    };
  });

  return (
    <>
      {/* ── HERO — full image with content overlaid left, vertically centred ── */}
      <section className="relative w-full" style={{ minHeight: "60vh" }}>
        <img
          src={config.home_hero?.image || "/Images/home/hero.jpg"}
          alt="Hero"
          className="w-full h-auto block"
          style={{ minHeight: "60vh", objectFit: "cover", objectPosition: "right center" }}
        />
        {/* gradient: strong on left, fades to transparent on right */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 70%, transparent 100%)" }} />
        {/* content overlay — left half only */}
        <div className="absolute inset-0 flex items-center">
          <div className="page-container w-full">
            <div style={{ maxWidth: "52%" }}>
              {/* Logo */}
              <img
                src="/Images/Logo2026.png"
                alt="SOR7ED"
                style={{ height: "clamp(28px, 4vw, 52px)", width: "auto", marginBottom: "clamp(16px, 3vw, 32px)" }}
              />
              {/* Headline */}
              <h1
                className="font-display font-black uppercase text-white leading-none"
                style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)", letterSpacing: "-0.02em", marginBottom: "clamp(12px, 2vw, 24px)" }}
              >
                SKIP THE NONSENSE
              </h1>
              {/* Subtitle */}
              <p style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", color: "rgba(255,255,255,0.75)", marginBottom: "clamp(20px, 3vw, 36px)", lineHeight: 1.5 }}>
                {config.home_hero_subtitle?.text || "Practical tools and protocols for neurodivergent adults — delivered straight to WhatsApp"}
              </p>
              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/tools" className="btn btn-lg" style={{ background: "#00C4C4", color: "#000", borderColor: "#00C4C4" }}>
                  Browse Tools →
                </Link>
                <Link href="/intelligence" className="btn btn-lg btn-ghost">
                  Read Articles
                </Link>
              </div>
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
