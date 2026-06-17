import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteConfig } from "@/lib/getSiteConfig";
import HeroSlideshow from "@/components/HeroSlideshow";
import BranchesGrid from "@/components/BranchesGrid";
import HomeTrustStrip from "@/components/HomeTrustStrip";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import AdhDTaxCalculator from "@/components/AdhDTaxCalculator";
import HomeSignupForm from "@/components/HomeSignupForm";

export const dynamic = 'force-dynamic';

const FALLBACK_BRANCHES = [
  { slug: "keep-going",   num: "01", label: "Keep Going",    emoji: "⚡", desc: "Career, learning, momentum, progress" },
  { slug: "feel-good",    num: "02", label: "Feel Good",     emoji: "🌿", desc: "Energy, sleep, meds, food, sensory support" },
  { slug: "spend-smart",  num: "03", label: "Spend Smart",   emoji: "💷", desc: "Bills, budgeting, impulse spending, money admin" },
  { slug: "be-connected", num: "04", label: "Be Connected",  emoji: "🤝", desc: "Relationships, communication, boundaries, scripts" },
  { slug: "plan-ahead",   num: "05", label: "Plan Ahead",    emoji: "🗓", desc: "Planning, executive function, systems, follow-through" },
  { slug: "be-yourself",  num: "06", label: "Be Yourself",   emoji: "🪞", desc: "Unmasking, identity, shame, self-concept, regulation" },
  { slug: "level-up",     num: "07", label: "Level Up",      emoji: "🚀", desc: "Digital systems, automation, apps, setups" },
];

const FALLBACK_ARTICLES = [
  {
    slug: "burnout-loop-nobody-warned-you-about",
    title: "The burnout loop nobody warned you about",
    branch: "Feel Good",
    summary: "Why ND burnout isn't laziness — and the recovery protocol that doesn't rely on willpower.",
    cover_image: ""
  },
  {
    slug: "people-pleasing-nervous-system-not-personality",
    title: "People-pleasing is a nervous system, not a personality",
    branch: "Be Connected",
    summary: "Scripts and boundaries for when \"no\" feels physically impossible.",
    cover_image: ""
  },
  {
    slug: "where-adhd-tax-actually-hides",
    title: "Where the ADHD tax actually hides",
    branch: "Spend Smart",
    summary: "The five quiet leaks draining your account — and how to plug them this week.",
    cover_image: ""
  }
];

export default async function HomePage() {
  const supabase = createAdminClient();
  const config = await getSiteConfig();

  // ── BRANCHES (Supabase + fallback) ──
  const { data: branchesData } = await supabase
    .from("branches")
    .select("slug, name, icon, description, cover_image, color")
    .order("num", { ascending: true });

  const branchList = (branchesData || []).map((b: any) => {
    const hc = FALLBACK_BRANCHES.find((h) => h.slug === b.slug);
    return {
      slug: b.slug,
      name: b.name || hc?.label || "",
      icon: b.icon || hc?.emoji || "⚡",
      description: b.description || hc?.desc || "",
      cover_image: b.cover_image || "",
    };
  });

  const branches = branchList.length > 0
    ? branchList
    : FALLBACK_BRANCHES.map((b) => ({
        slug: b.slug,
        name: b.label,
        icon: b.emoji,
        description: b.desc,
        cover_image: "",
      }));

  // ── LATEST ARTICLES (Supabase + fallback) ──
  const { data: articlesData } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image")
    .eq("status", "Published")
    .order("updated_at", { ascending: false })
    .limit(3);

  const articles = articlesData && articlesData.length > 0
    ? articlesData
    : FALLBACK_ARTICLES;

  return (
    <>
      {/* 1 ── HERO (Refactored split configuration layout) ── */}
      <HeroSlideshow config={config} />

      {/* 2 ── TRUST STRIP ── */}
      <HomeTrustStrip />

      {/* 3 ── HOW IT WORKS ── */}
      <HomeHowItWorks />

      {/* 4 ── 7 BRANCHES ── */}
      <section id="branches" className="section border-t border-[var(--color-line)] bg-transparent">
        <div className="page-container mb-12 flex flex-col gap-4 reveal in">
          <span className="t-label">/ The 7 Branches</span>
          <h2 className="t-heading text-3xl md:text-5xl font-medium">
            7 branches. One easier way to start.
          </h2>
          <p className="t-body mt-2">
            SOR7ED organizes support across the seven areas most affected by executive dysfunction, ADHD, autism and burnout. Pick the one that matters most right now.
          </p>
        </div>
        <div className="page-container">
          <BranchesGrid branches={branches} />
        </div>
      </section>

      {/* 5 ── FEATURED TOOL: ADHD TAX CALCULATOR ── */}
      <AdhDTaxCalculator />

      {/* 6 ── INTELLIGENCE / ARTICLES (Real data from Notion/Supabase) ── */}
      <section className="section border-t border-[var(--color-line)] bg-transparent">
        <div className="page-container">
          <div className="max-w-3xl mb-12 flex flex-col gap-4 reveal in">
            <span className="t-label">/ Intelligence</span>
            <h2 className="t-heading text-3xl md:text-5xl font-medium">
              Articles that explain what's <em>actually</em> happening
            </h2>
            <p className="t-body mt-2">
              We unpack the patterns behind burnout, loneliness, people-pleasing and money stress — with practical insight, not fluff. Read the protocol. Understand the pattern. Take the next step.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 reveal in">
            {articles.map((article) => {
              const img = article.cover_image;
              const hasImage = img && img !== "" && !img.includes("v2_img_");

              return (
                <Link
                  key={article.slug}
                  href={`/intelligence/${article.slug}`}
                  className="group card overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {hasImage ? (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-line)]">
                        <img
                          src={img}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      /* Clean typographic banner header fallback */
                      <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface)] border-b border-[var(--color-line)] flex items-center justify-center p-6 text-center">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-accent)] uppercase font-bold opacity-60">
                          // FIELD READ PROTOCOL
                        </span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col gap-3">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-[0.08em] px-2.5 py-0.5 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded self-start border border-[var(--color-line)]/50">
                        {article.branch || "Field Read"}
                      </span>
                      <h3 className="font-sans font-bold text-lg text-[var(--color-bone)] group-hover:text-[var(--color-accent)] transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] line-clamp-3 font-sans leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-line)]/40 text-[10px] font-mono tracking-widest text-[var(--color-accent)] font-bold">
                      <span>READ PROTOCOL</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-12 reveal in">
            <Link href="/articles" className="btn btn-ghost">
              Read more from Intelligence <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7 ── SIGNUP FORM (WhatsApp) ── */}
      <section id="signup" className="section border-t border-[var(--color-line)] bg-transparent">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6 reveal in">
              <div className="flex">
                <span className="text-[10px] tracking-[0.14em] uppercase font-mono font-bold px-3.5 py-1.5 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-full border border-[var(--color-line)]">
                  Delivered on WhatsApp
                </span>
              </div>
              <h2 className="t-heading text-3xl md:text-5xl font-medium">
                Get SOR7ED on WhatsApp
              </h2>
              <p className="t-body">
                Create your account once, then text a keyword to get step-by-step protocols delivered straight to your WhatsApp. Start free — no app, no subscription required.
              </p>
              
              {/* Premium CSS-only feature benefit card instead of static banner image */}
              <div className="card p-6 border border-[var(--color-line)] bg-[var(--color-surface)] flex flex-col gap-4 mt-2">
                <div className="t-mono text-[var(--color-accent)] font-bold text-[10px] uppercase tracking-wider">
                  // Platform Features
                </div>
                <div className="flex flex-col gap-3 font-sans text-xs text-[var(--color-muted)]">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[var(--color-accent)]">💬</span>
                    <div>
                      <strong className="text-[var(--color-bone)] font-semibold">Zero App Downloads:</strong> Everything runs inside WhatsApp where you already live.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[var(--color-accent)]">⚡</span>
                    <div>
                      <strong className="text-[var(--color-bone)] font-semibold">Instant Action:</strong> Answer 4 targeted questions, get your customized protocol immediately.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-base text-[var(--color-accent)]">🗓</span>
                    <div>
                      <strong className="text-[var(--color-bone)] font-semibold">Practical Guidance:</strong> Step-by-step support for executive dysfunction, ADHD and burnout.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal in">
              <HomeSignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* 8 ── FINAL CTA ── */}
      <section className="section border-t border-[var(--color-line)] bg-transparent text-center">
        <div className="page-container flex flex-col items-center py-8">
          <h2
            className="font-serif text-[var(--color-bone)] leading-none reveal in"
            style={{ fontSize: "clamp(2.75rem, 8vw, 7.5rem)", letterSpacing: "-0.025em" }}
          >
            Ready to get <span className="text-[var(--color-accent)]">SOR7ED?</span>
          </h2>
          <p className="t-body max-w-xl mx-auto mt-6 mb-10 reveal in">
            You don't need to fix everything at once. Start with one branch, one tool, or one
            protocol — and build from there.
          </p>
          <div className="flex gap-4 justify-center flex-wrap reveal in">
            <Link href="#signup" className="btn btn-primary btn-lg">Get started <span className="arrow">→</span></Link>
            <Link href="#branches" className="btn btn-ghost btn-lg">Explore the 7 branches <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
