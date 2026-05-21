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
      cover_image: b.cover_image || `/Images/branches/${b.slug}.png`,
      color: b.color || fallback?.color || "#00C4C4"
    };
  });

  // If Supabase fetch was completely empty, fallback to static defaults
  const displayBranches = branchList.length > 0 ? branchList : FALLBACK_BRANCHES.map(b => ({
    ...b,
    cover_image: `/Images/branches/${b.slug}.png`
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
    <div style={localStyle} className="pt-24 pb-20 min-h-screen">
      <div className="border-b border-white/10">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">7 areas of life</p>
          <h1 className="t-display mb-5 text-balance max-w-2xl text-white">
            {renderFormattedText(config.explore_hero_title?.text, 'var(--color-accent)')}
          </h1>
          <div className="t-body max-w-xl text-pretty text-white/60">
            {renderFormattedText(config.explore_hero_subtitle?.text, 'var(--color-accent)')}
          </div>
        </div>
      </div>

      <div className="page-container mt-12">
        <div className="flex flex-col gap-6">
          {/* Top row (4 cards on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {displayBranches.slice(0, 4).map((branch) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className="group relative aspect-square border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
              >
                <img
                  src={branch.cover_image}
                  alt={branch.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <div>
                    <p className="t-heading text-xs text-white font-bold mb-1">{branch.name}</p>
                    <p className="text-[10px] text-white/80 line-clamp-1 leading-none">{branch.description}</p>
                  </div>
                  <span className="text-accent font-bold text-sm shrink-0 ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row (3 cards centered on desktop) */}
          <div className="grid grid-cols-2 lg:flex lg:justify-center gap-6">
            {displayBranches.slice(4, 7).map((branch) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className="group relative aspect-square lg:w-[calc(25%-18px)] border border-white/10 hover:border-accent/50 overflow-hidden transition-all duration-300"
              >
                <img
                  src={branch.cover_image}
                  alt={branch.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <div>
                    <p className="t-heading text-xs text-white font-bold mb-1">{branch.name}</p>
                    <p className="text-[10px] text-white/80 line-clamp-1 leading-none">{branch.description}</p>
                  </div>
                  <span className="text-accent font-bold text-sm shrink-0 ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
