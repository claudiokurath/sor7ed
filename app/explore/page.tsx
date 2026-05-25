import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSiteConfig, renderFormattedText } from "@/lib/getSiteConfig";

const FALLBACK_BRANCHES = [
  { slug: "keep-going",   name: "Keep Going",    icon: "⚡", description: "Energy, momentum, getting unstuck", color: "#00C4C4" },
  { slug: "spend-smart",  name: "Spend Smart",   icon: "💷", description: "Money clarity without the shame", color: "#00A0C4" },
  { slug: "feel-good",    name: "Feel Good",     icon: "🌿", description: "Rest, body, nervous system", color: "#9B00C4" },
  { slug: "plan-ahead",   name: "Plan Ahead",    icon: "🗓", description: "Structure that actually works", color: "#00C4C4" },
  { slug: "be-connected", name: "Be Connected",  icon: "🤝", description: "Relationships, communication", color: "#3C8CE8" },
  { slug: "be-yourself",  name: "Be Yourself",   icon: "🪞", description: "Identity, self-knowledge", color: "#C400C4" },
  { slug: "level-up",     name: "Level Up",      icon: "🚀", description: "Skills, growth, work", color: "#C4A000" },
];

export default async function ExplorePage() {
  const config = await getSiteConfig();
  const supabase = await createClient();

  const { data: branchesData } = await supabase
    .from("branches")
    .select("slug, name, icon, description, cover_image, color")
    .order("num", { ascending: true });

  const branchList = (branchesData || []).map(b => {
    const fallback = FALLBACK_BRANCHES.find(f => f.slug === b.slug);
    return {
      slug: b.slug,
      name: b.name || fallback?.name || "",
      icon: b.icon || fallback?.icon || "⚡",
      description: b.description || fallback?.description || "",
      cover_image: b.cover_image || `/Images/members/${b.slug}.png`,
      color: b.color || fallback?.color || "#00C4C4"
    };
  });

  // If Supabase fetch was completely empty, fallback to static defaults
  const displayBranches = branchList.length > 0 ? branchList : FALLBACK_BRANCHES.map(b => ({
    ...b,
    cover_image: `/Images/members/${b.slug}.png`
  }));

  const pageBg = config.explore_bg_color?.color || '#080f11';
  const pageAccent = config.explore_accent_color?.color || '#00C4C4';

  const localStyle = {
    backgroundColor: pageBg,
    '--color-surface': pageBg,
    '--color-accent': pageAccent,
    '--color-accent-dim': pageAccent + '1a',
    '--color-accent-border': pageAccent + '40',
  } as React.CSSProperties;

  return (
    <div style={localStyle} className="pb-20 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/Images/banners/7 branches banner.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
          <p className="t-label text-white/50 mb-3 font-mono tracking-widest">7 AREAS OF LIFE</p>
          <h1
            className="font-display font-black uppercase text-white leading-none mb-6 max-w-2xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", letterSpacing: "-0.01em" }}
          >
            {renderFormattedText(config.explore_hero_title?.text, 'white') || '7 Branches'}
          </h1>
          <div className="text-white/60 text-base leading-relaxed max-w-md" style={{ fontFamily: "var(--font-mono)" }}>
            {renderFormattedText(config.explore_hero_subtitle?.text, 'white')}
          </div>
        </div>
      </section>

      <div className="page-container mt-12 lg:max-w-7xl xl:max-w-[1400px]">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 md:gap-6">
          {displayBranches.map((branch) => (
            <div key={branch.slug} className="flex flex-col items-center">
              <Link
                href={`/${branch.slug}`}
                className="group relative w-full aspect-square border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
              >
                <img
                  src={branch.cover_image}
                  alt={branch.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
              </Link>
              {/* Description under the box, no title */}
              <p className="text-[8px] sm:text-[10px] md:text-xs text-white/50 mt-2 text-center leading-tight font-sans">
                {branch.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
