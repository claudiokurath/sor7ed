import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import BranchesGrid from "@/components/BranchesGrid";
import { createClient } from "@/lib/supabase/server";

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
      {/* ── HERO SLIDESHOW ── */}
      <HeroSlideshow />

      {/* ── 7 BRANCHES GRID ────────────────────────────────── */}
      <section className="border-t border-border-subtle bg-surface-subtle/30">
        {/* Header inside container */}
        <div className="page-container py-10">
          <h2 className="t-display mb-2">7 Branches</h2>
          <p className="text-white/40 text-sm">
            Every article and tool maps to one of 7 areas of life.
          </p>
        </div>
        {/* Grid full width */}
        {branchList.length > 0 && (
          <BranchesGrid branches={branchList} />
        )}
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
