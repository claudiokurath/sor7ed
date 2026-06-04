import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import HeroSlideshow from "@/components/HeroSlideshow";
import BranchesGrid from "@/components/BranchesGrid";
import HomeTrustStrip from "@/components/HomeTrustStrip";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import AdhDTaxCalculator from "@/components/AdhDTaxCalculator";
import HomeSignupForm from "@/components/HomeSignupForm";

const BRANCHES = [
  { slug: "keep-going",   num: "01", label: "Keep Going",    emoji: "⚡", desc: "Career, learning, momentum, progress" },
  { slug: "feel-good",    num: "02", label: "Feel Good",     emoji: "🌿", desc: "Energy, sleep, meds, food, sensory support" },
  { slug: "spend-smart",  num: "03", label: "Spend Smart",   emoji: "💷", desc: "Bills, budgeting, impulse spending, money admin" },
  { slug: "be-connected", num: "04", label: "Be Connected",  emoji: "🤝", desc: "Relationships, communication, boundaries, scripts" },
  { slug: "plan-ahead",   num: "05", label: "Plan Ahead",    emoji: "🗓", desc: "Planning, executive function, systems, follow-through" },
  { slug: "be-yourself",  num: "06", label: "Be Yourself",   emoji: "🪞", desc: "Unmasking, identity, shame, self-concept, regulation" },
  { slug: "level-up",     num: "07", label: "Level Up",      emoji: "🚀", desc: "Digital systems, automation, apps, setups" },
];

export default async function HomePage() {
  const supabase = createAdminClient();

  // ── BRANCHES (Supabase + hardcoded fallback merge) ──
  const { data: branchesData } = await supabase
    .from("branches")
    .select("slug, name, icon, description, cover_image, color")
    .order("num", { ascending: true });

  const branchList = (branchesData || []).map((b: any) => {
    const hc = BRANCHES.find((h) => h.slug === b.slug);
    return {
      slug: b.slug,
      name: b.name || hc?.label || "",
      icon: b.icon || hc?.emoji || "⚡",
      description: b.description || hc?.desc || "",
      cover_image: `/Images/members/${b.slug}.png`,
    };
  });

  // Fall back to hardcoded list if Supabase returns nothing
  const branches =
    branchList.length > 0
      ? branchList
      : BRANCHES.map((b) => ({
          slug: b.slug,
          name: b.label,
          icon: b.emoji,
          description: b.desc,
          cover_image: `/Images/members/${b.slug}.png`,
        }));

  // ── ARTICLES TEASER (same query shape as app/articles/page.tsx) ──
  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary, cover_image, read_time")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(3);
  const articles = posts ?? [];

  return (
    <>
      {/* 1 ── HERO ── */}
      <HeroSlideshow />

      {/* 2 ── TRUST STRIP ── */}
      <HomeTrustStrip />

      {/* 3 ── HOW IT WORKS ── */}
      <HomeHowItWorks />

      {/* 4 ── 7 BRANCHES ── */}
      <section className="border-t border-border-subtle">
        <div className="relative w-full min-h-[34vh] flex items-end overflow-hidden">
          <img
            src="/Images/banners/7%20branches%20banner.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
          <div className="relative z-10 page-container py-10 md:py-14 w-full">
            <p className="t-label mb-3">The 7 Branches</p>
            <h2 className="t-display">7 branches. One easier way to start.</h2>
          </div>
        </div>
        <BranchesGrid branches={branches} />
      </section>

      {/* 5 ── ADHD TAX CALCULATOR ── */}
      <AdhDTaxCalculator />

      {/* 6 ── INTELLIGENCE TEASER (live data, same card markup as /articles) ── */}
      {articles.length > 0 && (
        <section className="section border-t border-border-subtle">
          <div className="page-container">
            <p className="t-label mb-3">Intelligence</p>
            <h2 className="t-display mb-10 max-w-2xl">
              Articles that explain what&apos;s actually happening
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
              {articles.map((article: any) => (
                <Link
                  key={article.slug}
                  href={`/intelligence/${article.slug}`}
                  className="group bg-[#0d1619] border border-white/10 overflow-hidden hover:border-accent/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-video overflow-hidden bg-[#0d1619] border-b border-white/5">
                      <img
                        src={article.cover_image || `/Images/articles/${article.slug}.jpg`}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <span className="tag tag-accent bg-black/40 border-accent/20 text-[10px] self-start">
                        {article.branch}
                      </span>
                      <h3 className="t-heading text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-[11px] text-white/60 line-clamp-2 font-sans leading-normal">
                          {article.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-5 pt-0 mt-auto">
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono tracking-widest text-accent">
                      <span className="text-white/40 font-mono font-normal normal-case">
                        {article.read_time ? `${article.read_time} min read` : ""}
                      </span>
                      <span>READ PROTOCOL →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/articles" className="btn btn-ghost">
                Read more from Intelligence →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7 ── WHATSAPP / SIGNUP CTA ── */}
      <section className="section border-t border-border-subtle">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="t-label mb-6">Delivered on WhatsApp</p>
              <h2 className="t-display mb-6">Get SOR7ED on WhatsApp</h2>
              <p className="t-body max-w-sm">
                Create your account once, then text a keyword to get step-by-step protocols
                delivered straight to your WhatsApp. Start free — no app, no subscription required.
              </p>
              <div className="relative mt-8 border border-border overflow-hidden">
                <img
                  src="/Images/banners/sign%20in%20banner.png"
                  alt="Sign in to SOR7ED"
                  className="w-full object-cover"
                  style={{ height: "clamp(140px, 18vh, 200px)" }}
                />
              </div>
            </div>
            <HomeSignupForm />
          </div>
        </div>
      </section>

      {/* 8 ── FOOTER CTA ── */}
      <section className="section border-t border-border-subtle text-center">
        <div className="page-container">
          <h2
            className="font-display uppercase text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 9rem)", lineHeight: 0.9, letterSpacing: "-0.01em" }}
          >
            Ready to get<br />
            <span className="text-accent">SOR7ED?</span>
          </h2>
          <p className="t-body max-w-md mx-auto mt-6 mb-10">
            You don&apos;t need to fix everything at once. Start with one branch, one tool, or one
            protocol — and build from there.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/signup" className="btn btn-primary btn-lg">Get started →</Link>
            <Link href="/explore" className="btn btn-ghost btn-lg">Explore the 7 Branches →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
