import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdhDTaxCalculator from "@/components/AdhDTaxCalculator";
import HomeSignupForm from "@/components/HomeSignupForm";
import RevealSetup from "@/components/RevealSetup";

const BRANCHES = [
  { slug: "keep-going",   num: "01", label: "Keep Going",    desc: "Career, learning, momentum, progress" },
  { slug: "feel-good",    num: "02", label: "Feel Good",     desc: "Energy, sleep, meds, food, sensory support" },
  { slug: "spend-smart",  num: "03", label: "Spend Smart",   desc: "Bills, budgeting, impulse spending, money admin" },
  { slug: "be-connected", num: "04", label: "Be Connected",  desc: "Relationships, communication, boundaries, scripts" },
  { slug: "plan-ahead",   num: "05", label: "Plan Ahead",    desc: "Planning, executive function, systems, follow-through" },
  { slug: "be-yourself",  num: "06", label: "Be Yourself",   desc: "Unmasking, identity, shame, self-concept, regulation" },
  { slug: "level-up",     num: "07", label: "Level Up",      desc: "Digital systems, automation, apps, setups" },
];

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2 4 6v6c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6l-8-4Z"/>
      </svg>
    ),
    title: "Neurodivergent-first",
    desc:  "Built for ADHD, autism, executive dysfunction & burnout",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Z"/>
      </svg>
    ),
    title: "Delivered on WhatsApp",
    desc:  "Support where you already are — no new app to learn",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Practical, step-by-step",
    desc:  "Tools, articles & protocols that reduce overwhelm",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
      </svg>
    ),
    title: "Across 7 areas of life",
    desc:  "Start anywhere with the area that matters most right now",
  },
];

const H2 = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2 style={{
    fontFamily: "'Archivo Expanded','Archivo',sans-serif",
    fontWeight: 800,
    fontSize: "clamp(28px,4.6vw,58px)",
    lineHeight: 0.98,
    letterSpacing: "-0.02em",
    color: "#eaf1ee",
    maxWidth: "17ch",
    ...style,
  }}>{children}</h2>
);

export default async function HomePage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("protocols")
    .select("slug, title, branch, summary")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(3);

  const articles = posts ?? [];

  return (
    <div style={{ background: "#0a0d0e" }}>
      <RevealSetup />

      {/* ── 1. HERO ───────────────────────────────────────── */}
      <section style={{
        paddingTop: "clamp(130px,19vh,200px)",
        paddingBottom: "clamp(40px,6vh,72px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: "60vw", height: "60vw", maxWidth: "780px", maxHeight: "780px",
          pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle, color-mix(in srgb,#2ee6c9 14%,transparent), transparent 62%)",
        }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "26px", flexWrap: "wrap" }}>
            <span className="hp-eyebrow">For neurodivergent adults</span>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: "11px",
              letterSpacing: ".14em", textTransform: "uppercase",
              color: "var(--hp-muted)", border: "1px solid var(--hp-line)",
              padding: "6px 12px", borderRadius: "100px",
            }}>Skip the nonsense</span>
          </div>

          <h1 style={{
            fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 800,
            fontSize: "clamp(40px,7.2vw,104px)", lineHeight: 0.96,
            letterSpacing: "-0.025em", maxWidth: "16ch", color: "#eaf1ee",
          }}>
            Practical protocols for{" "}
            <span style={{ color: "var(--hp-accent)" }}>neurodivergent</span> minds
          </h1>

          <p style={{
            marginTop: "clamp(22px,3vh,34px)", maxWidth: "600px",
            fontSize: "clamp(17px,1.7vw,22px)", color: "rgba(234,241,238,0.86)",
          }}>
            Get step-by-step support for{" "}
            <strong style={{ color: "#eaf1ee", fontWeight: 600 }}>
              money, planning, burnout, relationships
            </strong>{" "}
            and daily life — delivered straight to your WhatsApp.
          </p>

          <div style={{ display: "flex", gap: "13px", flexWrap: "wrap", marginTop: "clamp(28px,4vh,40px)" }}>
            <Link href="/tools"   className="hp-btn hp-btn-primary">Browse tools →</Link>
            <Link href="/explore" className="hp-btn hp-btn-ghost">Explore the 7 Branches →</Link>
          </div>

          <p style={{
            marginTop: "20px", fontFamily: "'JetBrains Mono',monospace",
            fontSize: "12.5px", color: "var(--hp-muted)", letterSpacing: ".02em",
            maxWidth: "52ch", lineHeight: 1.7,
          }}>
            No app. No subscription required. Start with one area and get practical support that
            actually fits how your brain works.
          </p>

          <div data-reveal style={{
            marginTop: "clamp(34px,5vh,58px)", borderRadius: "22px", overflow: "hidden",
            border: "1px solid var(--hp-line)", position: "relative", lineHeight: 0,
            boxShadow: "0 40px 90px -50px color-mix(in srgb,#2ee6c9 55%,transparent)",
          }}>
            <img
              src="/Images/home/hero.png"
              alt="A person getting practical support on their phone"
              style={{ width: "100%", height: "clamp(220px,42vh,470px)", objectFit: "cover", objectPosition: "center 42%", display: "block" }}
            />
            <span style={{
              position: "absolute", left: "18px", bottom: "16px", zIndex: 2,
              fontFamily: "'JetBrains Mono',monospace", fontSize: "11.5px",
              letterSpacing: ".08em", textTransform: "uppercase",
              color: "#eaf1ee", background: "rgba(10,13,14,0.66)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(234,241,238,0.18)",
              padding: "8px 13px", borderRadius: "100px",
              display: "inline-flex", alignItems: "center", gap: "8px", lineHeight: 1,
            }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--hp-accent)", display: "inline-block" }} />
              Support, straight to your WhatsApp
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST STRIP ────────────────────────────────── */}
      <section className="hp-trust" aria-label="Why SOR7ED">
        <div className="hp-trust-inner">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="hp-trust-item">
              <span style={{ color: "var(--hp-accent)" }}>{item.icon}</span>
              <div style={{
                fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                fontWeight: 700, fontSize: "clamp(15px,1.5vw,18px)", letterSpacing: "-0.01em",
                color: "#eaf1ee",
              }}>{item.title}</div>
              <div style={{ fontSize: "13.5px", color: "var(--hp-muted)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ───────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(64px,11vh,130px)" }} id="how">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)" }}>
          <div className="hp-band" data-reveal>
            <img className="hp-band-img" src="/Images/banners/dash%20banner.png" alt="" />
            <div className="hp-band-scrim" />
            <div className="hp-band-inner">
              <div className="hp-sec-label">/ How SOR7ED works</div>
              <H2>Three steps. Built for how your brain actually works.</H2>
            </div>
          </div>

          <p data-reveal style={{ color: "var(--hp-muted)", fontSize: "17px", maxWidth: "600px", marginBottom: "clamp(36px,5vh,64px)" }}>
            Start with the area that feels hardest right now — then follow practical support
            designed for the way you think, not against it.
          </p>

          <div className="hp-steps">
            {[
              { n: "Step 01", title: "Pick your branch",          body: "Choose the part of life you want to improve first — from money and planning to energy, identity, and relationships." },
              { n: "Step 02", title: "Use a tool or protocol",    body: "Start with a calculator, article, or structured protocol that helps you understand the problem and take the next step." },
              { n: "Step 03", title: "Get support on WhatsApp",   body: "Receive step-by-step guidance without downloading another app or trying to hold everything in your head." },
            ].map((s) => (
              <div key={s.n} className="hp-step" data-reveal>
                <div className="hp-step-n">{s.n}</div>
                <h3 style={{
                  fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                  fontWeight: 700, fontSize: "clamp(21px,2.2vw,28px)",
                  letterSpacing: "-0.01em", marginBottom: "12px", color: "#eaf1ee",
                }}>{s.title}</h3>
                <p style={{ color: "var(--hp-muted)", fontSize: "15.5px" }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "clamp(30px,4vh,44px)" }} data-reveal>
            <Link href="/explore" className="hp-btn hp-btn-ghost">See where to start →</Link>
          </div>
        </div>
      </section>

      {/* ── 4. 7 BRANCHES ─────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(64px,11vh,130px)", background: "var(--hp-surface)", borderBlock: "1px solid var(--hp-line)" }} id="branches">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)" }}>
          <div className="hp-band" data-reveal>
            <img className="hp-band-img" src="/Images/banners/7%20branches%20banner.png" alt="" />
            <div className="hp-band-scrim" />
            <div className="hp-band-inner">
              <div className="hp-sec-label">/ The 7 Branches</div>
              <H2>7 branches. One easier way to start.</H2>
            </div>
          </div>

          <p data-reveal style={{ color: "var(--hp-muted)", fontSize: "17px", maxWidth: "600px", marginBottom: "clamp(36px,5vh,64px)" }}>
            SOR7ED organises support across the seven areas most affected by executive dysfunction,
            ADHD, autism and burnout. Pick the one that matters most right now.
          </p>

          <div className="hp-branch-grid" data-reveal>
            {BRANCHES.map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} className="hp-branch">
                <img className="hp-branch-img" src={`/Images/members/${b.slug}.png`} alt={b.label} />
                <div className="hp-tile-scrim" />
                <span className="hp-branch-num">{b.num}</span>
                <div className="hp-tile-meta">
                  <div style={{
                    fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                    fontWeight: 700, fontSize: "clamp(17px,1.8vw,22px)",
                    letterSpacing: "-0.01em", marginBottom: "6px", color: "#eaf1ee",
                  }}>{b.label}</div>
                  <p style={{ color: "rgba(234,241,238,0.9)", fontSize: "13px", lineHeight: 1.4 }}>{b.desc}</p>
                </div>
              </Link>
            ))}

            <Link href="/explore" className="hp-branch hp-branch-cta">
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: "12px",
                color: "#04201b", opacity: 0.65, letterSpacing: ".1em",
              }}>→</div>
              <h3 style={{
                fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                fontWeight: 700, fontSize: "clamp(19px,2vw,25px)",
                letterSpacing: "-0.01em", marginTop: "14px", marginBottom: "12px",
                color: "#04201b",
              }}>Explore all 7 branches</h3>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: "13px",
                textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 700,
                display: "inline-flex", gap: "8px", alignItems: "center", color: "#04201b",
              }}>Find your starting point →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. ADHD TAX CALCULATOR ────────────────────────── */}
      <section style={{ paddingBlock: "clamp(64px,11vh,130px)" }} id="tool">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)" }}>
          <div className="hp-band" data-reveal>
            <img className="hp-band-img" src="/Images/banners/tools%20banner.png" alt="" />
            <div className="hp-band-scrim" />
            <div className="hp-band-inner">
              <div className="hp-sec-label">/ Tools</div>
              <H2>Start with a tool you can use today</H2>
            </div>
          </div>
          <AdhDTaxCalculator />
        </div>
      </section>

      {/* ── 6. INTELLIGENCE / ARTICLES ────────────────────── */}
      <section style={{ paddingBlock: "clamp(64px,11vh,130px)", background: "var(--hp-surface)", borderBlock: "1px solid var(--hp-line)" }} id="intelligence">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)" }}>
          <div className="hp-band" data-reveal>
            <img className="hp-band-img" src="/Images/banners/blog%20banner.png" alt="" />
            <div className="hp-band-scrim" />
            <div className="hp-band-inner">
              <div className="hp-sec-label">/ Intelligence</div>
              <H2>Articles that explain what&apos;s actually happening</H2>
            </div>
          </div>

          <p data-reveal style={{ color: "var(--hp-muted)", fontSize: "17px", maxWidth: "600px", marginBottom: "clamp(36px,5vh,64px)" }}>
            We unpack the patterns behind burnout, loneliness, people-pleasing and money stress —
            with practical insight, not fluff. Read the protocol. Understand the pattern.
            Take the next step.
          </p>

          <div className="hp-art-grid">
            {articles.length > 0 ? articles.map((a) => (
              <Link key={a.slug} href={`/intelligence/${a.slug}`} className="hp-art-card" data-reveal>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: "11px",
                  textTransform: "uppercase", letterSpacing: ".08em", color: "var(--hp-accent)",
                  marginBottom: "auto",
                }}>{a.branch}</div>
                <h3 style={{
                  fontFamily: "'Archivo Expanded','Archivo',sans-serif",
                  fontWeight: 700, fontSize: "clamp(19px,2vw,24px)",
                  letterSpacing: "-0.01em", margin: "30px 0 10px", lineHeight: 1.08,
                  color: "#eaf1ee",
                }}>{a.title}</h3>
                {a.summary && (
                  <p style={{ color: "var(--hp-muted)", fontSize: "14px" }}>{a.summary}</p>
                )}
                <span style={{
                  marginTop: "18px", fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px", textTransform: "uppercase", letterSpacing: ".05em",
                  color: "#eaf1ee", display: "inline-flex", gap: "7px",
                }}>Read article →</span>
              </Link>
            )) : (
              /* fallback static cards when DB is empty */
              [
                { tag: "Feel Good",    title: "The burnout loop nobody warned you about", body: "Why ND burnout isn't laziness — and the recovery protocol that doesn't rely on willpower.", href: "/intelligence" },
                { tag: "Be Connected", title: "People-pleasing is a nervous system, not a personality", body: "Scripts and boundaries for when “no” feels physically impossible.", href: "/intelligence" },
                { tag: "Spend Smart",  title: "Where the ADHD tax actually hides", body: "The five quiet leaks draining your account — and how to plug them this week.", href: "/intelligence" },
              ].map((a) => (
                <Link key={a.title} href={a.href} className="hp-art-card" data-reveal>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--hp-accent)", marginBottom: "auto" }}>{a.tag}</div>
                  <h3 style={{ fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 700, fontSize: "clamp(19px,2vw,24px)", letterSpacing: "-0.01em", margin: "30px 0 10px", lineHeight: 1.08, color: "#eaf1ee" }}>{a.title}</h3>
                  <p style={{ color: "var(--hp-muted)", fontSize: "14px" }}>{a.body}</p>
                  <span style={{ marginTop: "18px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".05em", color: "#eaf1ee", display: "inline-flex", gap: "7px" }}>Read article →</span>
                </Link>
              ))
            )}
          </div>

          <div style={{ marginTop: "clamp(30px,4vh,44px)" }} data-reveal>
            <Link href="/intelligence" className="hp-btn hp-btn-ghost">Read more from Intelligence →</Link>
          </div>
        </div>
      </section>

      {/* ── 7. SIGNUP ─────────────────────────────────────── */}
      <section style={{ paddingBlock: "clamp(64px,11vh,130px)" }} id="signup">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)" }}>
          <div className="hp-signup" data-reveal>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontFamily: "'JetBrains Mono',monospace", fontSize: "12px",
                textTransform: "uppercase", letterSpacing: ".06em", color: "var(--hp-accent)",
                marginBottom: "22px",
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Z"/>
                </svg>
                Delivered on WhatsApp
              </div>
              <h2 style={{
                fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 800,
                fontSize: "clamp(28px,4vw,50px)", lineHeight: 1, letterSpacing: "-0.02em",
                marginBottom: "18px", color: "#eaf1ee",
              }}>Get SOR7ED on WhatsApp</h2>
              <p style={{ color: "var(--hp-muted)", fontSize: "16.5px", maxWidth: "42ch" }}>
                Create your account once, then text a keyword to get step-by-step protocols delivered
                straight to your WhatsApp. Start free — no app, no subscription required.
              </p>
              <div className="hp-signup-media">
                <img src="/Images/banners/sign%20in%20banner.png" alt="Sign in to SOR7ED" />
              </div>
            </div>
            <HomeSignupForm />
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ──────────────────────────────────── */}
      <section className="hp-final">
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "clamp(20px,5vw,60px)", position: "relative" }}>
          <h2 data-reveal style={{
            fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 800,
            fontSize: "clamp(40px,9vw,130px)", lineHeight: 0.9, letterSpacing: "-0.025em",
            textTransform: "uppercase", color: "#eaf1ee",
          }}>
            Ready to get<br /><span style={{ color: "var(--hp-accent)" }}>SOR7ED?</span>
          </h2>
          <p data-reveal style={{ color: "var(--hp-muted)", maxWidth: "44ch", margin: "24px auto 36px", fontSize: "17.5px" }}>
            You don&apos;t need to fix everything at once. Start with one branch, one tool, or one
            protocol — and build from there.
          </p>
          <div data-reveal style={{ display: "flex", gap: "13px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup"  className="hp-btn hp-btn-primary">Get started →</Link>
            <Link href="/explore" className="hp-btn hp-btn-ghost">Explore the 7 Branches →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
