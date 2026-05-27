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
        <div className="page-container lg:max-w-[1400px]">
          {/* Header */}
          <div className="mb-10">
            <h2 className="t-display mb-3">7 Branches</h2>
            <p className="t-label text-white/40 font-mono tracking-widest uppercase max-w-2xl">
              Every article and every tool maps to one of 7 branches —{" "}
              the areas of life where neurodivergent adults are most underserved and most overlooked.
            </p>
          </div>

          {/* Grid: feature card full-width top, then 3 cols × 2 rows */}
          {branchList.length > 0 && (
            <div className="flex flex-col gap-3 md:gap-4">

              {/* Featured card — first branch, full width */}
              <Link
                href={`/${branchList[0].slug}`}
                className="group relative w-full overflow-hidden"
                style={{ aspectRatio: "16/7" }}
              >
                <img
                  src={branchList[0].cover_image}
                  alt={branchList[0].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10">
                  <p
                    className="font-display font-black uppercase text-white leading-none"
                    style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
                  >
                    {branchList[0].name}
                  </p>
                </div>
              </Link>

              {/* Remaining 6 branches — 3 columns × 2 rows */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {branchList.slice(1).map((b) => (
                  <Link
                    key={b.slug}
                    href={`/${b.slug}`}
                    className="group relative overflow-hidden"
                    style={{ aspectRatio: "1/1" }}
                  >
                    <img
                      src={b.cover_image}
                      alt={b.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3 md:p-5">
                      <p
                        className="font-display font-black uppercase text-white leading-none"
                        style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.6rem)", letterSpacing: "-0.02em" }}
                      >
                        {b.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
